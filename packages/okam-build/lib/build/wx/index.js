/**
 * @file Weixin mini program build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');
const {registerProcessor} = require('../../processor/type');
const {updateReferProcessorInfo} = require('../../processor/type');
const wxmlPlugin = require('../../processor/template/plugins/native/wxml-plugin');

class BuildWxAppManager extends BuildManager {

    /**
     * @override
     */
    getModulePathKeepExtnames() {
        return ['.wxs'];
    }

    /**
     * @override
     */
    initProcessor(buildConf) {
        super.initProcessor(buildConf);
        updateReferProcessorInfo('filter', this.defaultBabelProcessorName);

        registerProcessor({
            name: 'nativeView',
            processor: 'view',
            extnames: ['wxml'],
            options: {
                keepOriginalContent: true,
                plugins: [wxmlPlugin]
            }
        });
    }

    /**
     * @override
     */
    getFilterTransformOptions() {
        let opts = super.getFilterTransformOptions();
        if (opts) {
            opts.format = 'commonjs';
        }

        return opts;
    }
}

module.exports = BuildWxAppManager;
