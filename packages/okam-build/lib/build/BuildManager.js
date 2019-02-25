/**
 * @file Build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const pathUtil = require('path');
const EventEmitter = require('events');
const {colors, Timer, merge, babel: babelUtil, file: fileUtil} = require('../util');
const loadProcessFiles = require('./load-process-files');
const CacheManager = require('./CacheManager');
const FileOutput = require('../generator/FileOutput');
const processor = require('../processor');
const npm = require('../processor/helper/npm');
const {getDefaultBabelProcessor} = require('../processor/helper/processor');
const ModuleResolver = require('./ModuleResolver');
const allAppTypes = require('./app-type');
const cleanBuild = require('./clean-build');
const initGlobalComponents = require('./global-component');

class BuildManager extends EventEmitter {
    constructor(buildConf) {
        super();

        let {component, appType, logger, resolve} = buildConf;

        Object.assign(this, {
            buildConf,
            logger,
            appType,
            componentConf: component,
            componentExtname: component.extname
        });

        this.resolver = new ModuleResolver({
            logger,
            appType,
            resolve,
            extensions: [component.extname]
        });

        let env = process.env.NODE_ENV;
        this.buildEnv = env;
        this.envConfigKey = `_${appType}Env`;
        this.isDev = env === 'dev' || env === 'development';
        this.isProd = !env || env === 'prod' || env === 'production';

        this.initBuildRules(buildConf);

        this.runningTasks = [];
        this.doneTasks = [];
        this.waitingBuildFiles = [];
        this.cache = new CacheManager({cacheDir: buildConf.cacheDir});
    }

    /**
     * Initialize the imported global component definition
     *
     * @private
     * @param {Object} componentConf the component config
     */
    initGlobalComponents(componentConf) {
        this.globalComponents = initGlobalComponents(
            this.appType, componentConf, this.sourceDir
        );
    }

    /**
     * Initialize used processors
     *
     * @protected
     * @param {Object} buildConf the build config
     */
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

        this.defaultBabelProcessorName = getDefaultBabelProcessor(
            buildConf.processors
        );
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

        // add APP_TYPE process env variable replacement processor
        this.rules.push({
            match(file) {
                return file.isScript;
            },
            processors: [
                [
                    'replacement',
                    {'process.env.APP_TYPE': `"${this.appType}"`}
                ]
            ]
        });

        processors && (processors = merge({}, baseProcessors, processors));
        buildConf.processors = processors || baseProcessors;
        this.initProcessor(buildConf);
    }

    onAddNewFile(file) {
        if (this.envFileUpdated) {
            return;
        }

        // replace module okam-core/na/index.js content using specified app env module
        if (file.path.indexOf('node_modules/okam-core/src/na/index.js') !== -1) {
            let naEnvModuleId = `../${this.appType}/env`;
            file.content = `'use strict;'\nexport * from '${naEnvModuleId}';\n`;
            this.envFileUpdated = true;
        }
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

        this.addNewFileHandler = this.onAddNewFile.bind(this);
        files.on('addFile', this.addNewFileHandler);

        let {output, wx2swan, designWidth} = this.buildConf;
        this.compileContext = {
            cache: this.cache,
            resolve: npm.resolve.bind(null, this),
            addFile: this.addNewFile.bind(this),
            getFileByFullPath: this.getFileByFullPath.bind(this),
            designWidth,
            appType: this.appType,
            allAppTypes,
            logger: this.logger,
            envConfigKey: this.envConfigKey,
            sourceDir,
            root,
            output,
            wx2swan,
            componentExtname: this.componentExtname
        };

        this.initGlobalComponents(this.buildConf.component);

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
     * @param {Object=} opts the extra resolve options
     * @return {string}
     */
    resolve(requireModId, file, opts) {
        return this.resolver.resolve(requireModId, file, opts);
    }

    /**
     * Get mini program native base class, e.g., App/Page/Component
     *
     * @return {?Object}
     */
    getOutputAppBaseClass() {
        return this.buildConf.output.appBaseClass;
    }

     /**
     * Get the app base class init options
     *
     * @param {Object} file the file to process
     * @param {Object} config the config info defined in config property
     * @param {Object} opts the options
     * @param {boolean=} opts.isApp whether is app instance init
     * @param {boolean=} opts.isPage whether is page instance init
     * @param {boolean=} opts.isComponent whether is component instance init
     * @return {?Object}
     */
    getAppBaseClassInitOptions(file, config, opts) {
        // do nothing, subclass should provide implementation if needed
        // for model framework
        if (!opts.isApp && this.isEnableModelSupport()) {
            return {
                isSupportObserve: this.isEnableFrameworkExtension('data')
            };
        }
        return null;
    }

    /**
     * Get the filter transform options
     *
     * @return {?Object}
     */
    getFilterTransformOptions() {
        let enable = this.isEnableFilterSupport();
        if (enable) {
            let isUsingBabel7 = this.defaultBabelProcessorName === 'babel7';
            return {
                format: 'es6',
                usingBabel6: !isUsingBabel7
            };
        }
        return null;
    }

    /**
     * Get the module path resolve to keep path extnames
     *
     * @return {?Array.<string>}
     */
    getModulePathKeepExtnames() {
        return null;
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

    /**
     * Clear the old build output
     */
    clear() {
        let {logger, output: outputOpts} = this.buildConf;
        let {dir: outputDir, pathMap: outputPathMap} = outputOpts;

        logger.info('clean old build output...');

        let projectConfig = outputPathMap.projectConfig;
        let filter = (this.getClearFilter && this.getClearFilter())
            || (projectConfig ? [projectConfig] : []);
        cleanBuild({
            outputDir,
            filter
        });
    }

    /**
     * Build dependencies files
     *
     * @param {Timer} t the build timer
     * @return {boolean}
     */
    buildDependencies(t) {
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

        return buildFail;
    }

    /**
     * Start to build app
     *
     * @param {Timer} timer the build timer
     * @return {Promise}
     */
    build(timer) {
        let logger = this.logger;
        let t = new Timer();

        // build files that need to compile
        let buildFail = this.buildDependencies(t);
        if (buildFail) {
            return Promise.reject('error happen');
        }

        this.onBuildDone && this.onBuildDone();

        logger.info('process files done:', colors.gray(timer.tick()));
        return Promise.resolve();
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

    isEnableMixinSupport() {
        return this.isEnableFrameworkExtension('behavior');
    }

    isEnableFilterSupport() {
        return this.isEnableFrameworkExtension('filter');
    }

    isEnableModelSupport() {
        return this.isEnableFrameworkExtension('model');
    }

    isEnableVHtmlSupport() {
        return this.isEnableFrameworkExtension('vhtml');
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

        let {rext, content, deps, sourceMap, ast} = compileResult;
        file.compiled = true;
        file.content = content;
        rext && (file.rext = rext);
        ast && (file.ast = ast);

        deps && deps.forEach(item => {
            this.logger.debug('add dep', item);
            if (!pathUtil.isAbsolute(item)) {
                item = pathUtil.join(
                    pathUtil.dirname(file.fullPath), item
                );
                this.logger.debug('absolute dep', item);
            }

            let depFile = this.files.addFile(item);
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
                    this.logger.error(
                        `process file ${file.path} async task error:`,
                        res && res.err
                    );

                    if (file.isImg) {
                        // output image file even if fail
                        this.emit('asyncDone', file);
                    }
                    else {
                        this.emit('asyncError', res ? res.err : 'error');
                    }
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

/**
 * Create build manager
 *
 * @param {string} appType the app type to build
 * @param {Object} buildConf the build config
 * @return {BuildManager}
 */
BuildManager.create = function (appType, buildConf) {
    let buildManagerPath = pathUtil.join(__dirname, appType, 'index.js');
    let BuildClass = BuildManager;
    if (fileUtil.isFileExists(buildManagerPath)) {
        BuildClass = require(buildManagerPath);
    }

    return new BuildClass(buildConf);
};

module.exports = exports = BuildManager;
