/**
 * @file Alipay ant mini program build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');
const initNativeAntProcessor = require('./init-native-ant-processor');
const {updateReferProcessorInfo} = require('../../processor/type');

class BuildAntAppManager extends BuildManager {

    /**
     * @override
     */
    getModulePathKeepExtnames() {
        return ['.sjs'];
    }

    /**
     * @override
     */
    initProcessor(buildConf) {
        super.initProcessor(buildConf);

        updateReferProcessorInfo('filter', this.defaultBabelProcessorName);

        // register native ant processor
        let nativeOpts = buildConf.native;
        if (nativeOpts !== false) {
            initNativeAntProcessor(nativeOpts, this.defaultBabelProcessorName);
        }
    }
}

module.exports = BuildAntAppManager;
