/**
 * @file Quick app build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');

const VALIDATED_DATA_TYPES = ['public', 'protected', 'private'];

class BuildQuickAppManager extends BuildManager {

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
    }

    /**
     * @override
     */
    getAppBaseClassInitOptions(config, opts) {
        if (!opts.isPage) {
            return;
        }

        let envConfig = config[this.envConfigKey];
        let dataAccessType = envConfig && envConfig.data;
        if (dataAccessType) {
            if (!VALIDATED_DATA_TYPES.includes(dataAccessType)) {
                this.logger.warn('illegal quick app page data type:', dataAccessType);
            }
            return {dataAccessType};
        }
    }

    /**
     * Processor the app config after build done
     */
    onBuildDone() {
        let appConfigFile = this.getAppConfigFile();
        if (appConfigFile) {
            appConfigFile.compileReady = true;
            this.compile(appConfigFile);
        }
    }
}

module.exports = BuildQuickAppManager;
