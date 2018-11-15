/**
 * @file Build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const EventEmitter = require('events');
const resolve = require('resolve');
const pathUtil = require('path');
const {colors, Timer, merge, babel: babelUtil} = require('../util');
const loadProcessFiles = require('./load-process-files');
const CacheManager = require('./CacheManager');
const FileOutput = require('../generator/FileOutput');
const processor = require('../processor');
const npm = require('../processor/helper/npm');
const {getDefaultBabelProcessor} = require('../processor/helper/processor');

class BuildManager extends EventEmitter {
    constructor(buildConf) {
        super();

        let {component, appType, logger} = buildConf;

        Object.assign(this, {
            buildConf,
            logger,
            appType,
            componentConf: component,
            componentExtname: component.extname
        });
        this.resolveExtnames = [
            '.js', '.' + component.extname, '.ts'
        ];

        let env = process.env.NODE_ENV;
        this.buildEnv = env;
        this.isDev = env === 'dev' || env === 'development';
        this.isProd = !env || env === 'prod' || env === 'production';

        this.initBuildRules(buildConf);

        this.runningTasks = [];
        this.doneTasks = [];
        this.waitingBuildFiles = [];
        this.cache = new CacheManager({cacheDir: buildConf.cacheDir});
    }

    initProcessor(buildConf) {
        // register custom processors
        processor.registerProcessor(buildConf.processors);

        // register component file default processor
        let componentConf = buildConf.component;
        if (componentConf && componentConf.extname) {
            processor.registerProcessor([{
                name: 'component',
                extnames: componentConf.extname
            }]);
        }

        const appType = this.appType;
        const nativeOpts = buildConf.native;
        const defaultBabelProcessorName = getDefaultBabelProcessor(
            buildConf.processors
        );
        if (appType === 'swan') {
            // register native swan processor
            if (nativeOpts !== false) {
                require('./init-native-swan-processor')(nativeOpts, defaultBabelProcessorName);
            }

            // register wx2swan processors
            let wx2swanOpts = buildConf.wx2swan;
            if (wx2swanOpts) {
                require('./init-wx2swan-processor')(wx2swanOpts, defaultBabelProcessorName);
            }
        }
        else if (appType === 'ant') {
            // register native swan processor
            if (nativeOpts !== false) {
                require('./init-native-ant-processor')(nativeOpts, defaultBabelProcessorName);
            }
        }
    }

    /**
     * Initialize build rules
     *
     * @private
     * @param {Object} buildConf the build config
     */
    initBuildRules(buildConf) {
        let extraConf = this.buildEnv && buildConf[this.buildEnv];
        if (this.isDev) {
            extraConf || (extraConf = buildConf.dev || buildConf.development);
        }
        else if (this.isProd) {
            extraConf || (extraConf = buildConf.prod || buildConf.production);
        }

        let {rules: baseRules, processors: baseProcessors} = buildConf;
        let {rules, processors} = extraConf || {};

        rules && (rules = [].concat(baseRules, rules));
        this.rules = rules || baseRules || [];

        processors && (processors = merge({}, baseProcessors, processors));
        buildConf.processors = processors || baseProcessors;
        this.initProcessor(buildConf);
    }

    /**
     * Load the files that will be processed
     */
    loadFiles() {
        let {
            root,
            sourceDir,
            files,
            buildFiles
        } = loadProcessFiles(this.buildConf, this.logger);

        this.files = files;
        this.root = root;
        this.sourceDir = sourceDir;
        this.babelConfig = babelUtil.readBabelConfig(root);
        this.waitingBuildFiles = buildFiles;

        let {output} = this.buildConf;
        this.compileContext = {
            cache: this.cache,
            resolve: npm.resolve.bind(null, this),
            addFile: this.addNewFile.bind(this),
            getFileByFullPath: this.getFileByFullPath.bind(this),
            appType: this.appType,
            logger: this.logger,
            root,
            output
        };

        this.generator = new FileOutput(this, this.buildConf.output);
    }

    /**
     * Add new file to process
     *
     * @param {string} fullPath the new file full path to add
     * @return {Object}
     */
    addNewFile(fullPath) {
        let result = this.files.addFile(fullPath);
        this.addNeedBuildFile(result);
        return result;
    }

    /**
     * Add file that need to build
     *
     * @param {Object} file the file need to recompile
     * @param {boolean=} force whether force recompile if the file is compiled,
     *        by default false
     */
    addNeedBuildFile(file, force = false) {
        if (!force && file.compiled) {
            return;
        }

        let reBuilds = this.waitingBuildFiles;
        if (reBuilds.indexOf(file) === -1) {
            reBuilds.push(file);
        }
    }

    /**
     * Resolve module id file path
     *
     * @param {string} requireModId the module id to require
     * @param {string|Object} file the full file path or virtual file object
     *        to require the given module id
     * @return {string}
     */
    resolve(requireModId, file) {
        let depFile;
        let logger = this.logger;
        let filePath = typeof file === 'string' ? file : file.fullPath;
        try {
            depFile = resolve.sync(
                requireModId,
                {
                    extensions: this.resolveExtnames,
                    basedir: pathUtil.dirname(filePath)
                }
            );

            if (depFile === requireModId) {
                logger.warn('resolve native module', depFile, 'in', filePath);
                return;
            }
            logger.debug('resolve module', requireModId, filePath, depFile);
        }
        catch (ex) {
            logger.error('resolve dep module:', requireModId, 'in', filePath, 'fail');
        }

        return depFile;
    }

    /**
     * Compile file
     *
     * @param {Object} file the file to compile
     * @param {Timer=} timer the timer to statistic the consume time to compile
     * @return {boolean}
     */
    compile(file, timer) {
        timer || (timer = new Timer());
        timer.restart();

        let logger = this.logger;
        let {watch: isWatchMode} = this.buildConf;

        try {
            processor.compile(file, this);
        }
        catch (ex) {
            logger.error(
                'process file fail',
                colors.cyan(file.path),
                colors.gray(timer.tick())
            );

            if (!isWatchMode) {
                throw ex;
            }
            else {
                logger.error('error stack:\n', ex.stack || ex.message || ex.toString());
                return false;
            }
        }

        logger.info('process', colors.cyan(file.path), colors.gray(timer.tick()));
        return true;
    }

    build(timer) {
        let logger = this.logger;

        let t = new Timer();
        let buildFail = false;

        // build files that need to compile
        let waitingBuildFiles = this.waitingBuildFiles;
        while (waitingBuildFiles.length) {
            let f = waitingBuildFiles.shift();
            if (!this.compile(f, t)) {
                buildFail = true;
                break;
            }
        }

        if (buildFail) {
            return Promise.reject('error happen');
        }

        logger.info('process files done:', colors.gray(timer.tick()));
        return true;
    }

    release(files) {
        return this.generator.release(files);
    }

    createFile(path) {
        let file = this.files.getByPath(path);
        file || (file = this.files.addFile({path}));
        return file;
    }

    getFileByPath(path) {
        return this.files.getByPath(path);
    }

    getFileByFullPath(fullPath) {
        return this.files.getByFullPath(fullPath);
    }

    getBuildEnv() {
        return this.isDev ? 'dev' : (this.isProd ? 'prod' : this.buildEnv);
    }

    isEnableFrameworkExtension(type) {
        let framework = this.buildConf.framework;
        return framework && framework.some(pluginType => {
            if (Array.isArray(pluginType)) {
                pluginType = pluginType[0];
            }
            return pluginType === type;
        });
    }

    isEnableRefSupport() {
        return this.isEnableFrameworkExtension('ref');
    }

    getProcessFileCount() {
        return this.files ? this.files.length : 0;
    }

    getProcessFiles() {
        return this.files || [];
    }

    getFilesByDep(depPath) {
        return this.files.getFilesByDep(depPath);
    }

    getBuildRules() {
        return this.rules;
    }

    isExtractBabelHelper() {
        return this.extactBabelHelper;
    }

    updateFileCompileResult(file, compileResult) {
        if (!compileResult) {
            return;
        }

        let {content, deps, sourceMap, ast} = compileResult;
        file.compiled = true;
        file.content = content;
        ast && (file.ast = ast);

        deps && deps.forEach(item => {
            let depFile = this.files.getByPath(item);
            depFile || (depFile = this.files.addFile({path: item}));
            file.addDeps(depFile.path);
            this.addNeedBuildFile(depFile);
        });

        sourceMap && (file.sourceMap = sourceMap);
    }

    removeAsyncTask(promise) {
        let tasks = this.runningTasks;
        for (let i = tasks.length - 1; i >= 0; i--) {
            let item = tasks[i];
            if (item.promise === promise) {
                tasks.splice(i, 1);
                return item;
            }
        }
    }

    addAsyncTask(file, promise) {
        file.processing = true;
        promise.then(
            null,
            err => {
                return {
                    err
                };
            }
        ).then(
            res => {
                file.processing = false;
                this.removeAsyncTask(file);

                if (!res || res.err) {
                    this.emit('asyncError', res ? res.err : 'error');
                }
                else {
                    this.updateFileCompileResult(file, res);
                    this.emit('asyncDone', file);
                }
            }
        );
        this.runningTasks.push({file, promise});
    }

}

module.exports = exports = BuildManager;
