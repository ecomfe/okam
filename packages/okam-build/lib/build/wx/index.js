/**
 * @file Weixin mini program build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');
const {updateReferProcessorInfo} = require('../../processor/type');

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
