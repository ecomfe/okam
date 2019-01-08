/**
 * @file Quick app build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const BuildManager = require('../BuildManager');
const processor = require('../../processor');

const VALIDATED_DATA_TYPES = ['public', 'protected', 'private'];

class BuildQuickAppManager extends BuildManager {

    /**
     * @override
     */
    onAddNewFile(file) {
        super.onAddNewFile(file);

        if (file.extname === 'ux') {
            file.isNativeComponent = true;
        }
    }

    /**
     * Get all page config files
     *
     * @return {Array.<Object>}
     */
    getAllPageConfigFiles() {
        let result = [];

        this.files.forEach(item => {
            if (!item.isPageComponent) {
                return;
            }

            let subFiles = item.subFiles;
            let found;

            subFiles && subFiles.some(item => {
                if (item.isConfig) {
                    found = item;
                    return true;
                }
                return false;
            });

            found && result.push(found);
        });

        return result;
    }

    /**
     * Get all used API features for quick app
     *
     * @return {Array.<string>}
     */
    getAllUsedAPIFeatures() {
        let result = [];

        this.files.forEach(({features}) => {
            if (!features) {
                return;
            }

            for (let i = 0, len = features.length; i < len; i++) {
                let item = features[i];
                if (!result.includes(item)) {
                    result.push(item);
                }
            }
        });

        return result;
    }

    /**
     * Get app config file
     *
     * @return {?Object}
     */
    getAppConfigFile() {
        let found;
        this.files.some(item => {
            if (!item.isEntryScript) {
                return false;
            }

            let subFiles = item.subFiles || [];
            for (let i = 0, len = subFiles.length; i < len; i++) {
                let f = subFiles[i];
                if (f.isConfig) {
                    found = f;
                    return true;
                }
            }
            return true;
        });
        return found;
    }

    /**
     * @override
     */
    loadFiles() {
        super.loadFiles();
        Object.assign(this.compileContext, {
            getAllPageConfigFiles: this.getAllPageConfigFiles.bind(this),
            getAllUsedAPIFeatures: this.getAllUsedAPIFeatures.bind(this)
        });
        this.initAddCSSDependenciesProcessor();
    }

    /**
     * @override
     */
    getFilterTransformOptions() {
        let opts = super.getFilterTransformOptions();
        opts || (opts = {});
        opts.keepFiltersProp = true;
        return opts;
    }

    /**
     * Init the auto adding the css style dependencies processor
     *
     * @private
     */
    initAddCSSDependenciesProcessor() {
        let found;
        this.files.some(item => item.isEntryStyle && (found = item));
        if (!found) {
            return;
        }

        found.allowRelease = true;

        // avoid the file output path return `false`, here we make an assumption
        // that the file has been compiled
        found.compiled = true;
        let outputPath = this.generator.getOutputPath(found);
        found.compiled = false; // reset compiled info

        // init addCssDependencies processor options
        processor.registerProcessor({
            addCssDependencies: {
                options: {
                    styleFiles: [
                        path.join(this.root, outputPath)
                    ]
                }
            }
        });
    }

    /**
     * @override
     */
    getAppBaseClassInitOptions(file, config, opts) {
        if (!opts.isPage || !config) {
            return;
        }

        let extraData;
        let envConfig = config[this.envConfigKey];
        let dataAccessType = envConfig && envConfig.data;
        if (dataAccessType) {
            if (!VALIDATED_DATA_TYPES.includes(dataAccessType)) {
                this.logger.warn('illegal quick app page data type:', dataAccessType);
            }
            extraData = {dataAccessType};
        }

        if (this.isEnableFrameworkExtension('watch')) {
            let watchCounter = 0;
            let content = file.content.toString();
            let watchApiCallRegexp = /\.\$watch(\s|\(|,|;|$)/g;
            while (watchApiCallRegexp.exec(content)) {
                watchCounter++;
            }

            extraData || (extraData = {});
            extraData.watcherCounter = watchCounter;
        }

        return extraData;
    }

    /**
     * Get the build clear filter
     *
     * @protected
     * @return {Function}
     */
    getClearFilter() {
        return filePath => {
            let result = filePath.indexOf('src') !== 0;
            return result;
        };
    }

    /**
     * Processor the app config after build done
     */
    onBuildDone() {
        let appConfigFile = this.getAppConfigFile();
        if (appConfigFile) {
            appConfigFile.owner.processed = true;
            appConfigFile.compileReady = true;
            this.compile(appConfigFile);
        }
    }
}

module.exports = BuildQuickAppManager;
