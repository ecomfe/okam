/**
 * @file Alipay ant mini program build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');
const initNativeAntProcessor = require('./init-native-ant-processor');
const {getDefaultBabelProcessor} = require('../../processor/helper/processor');

class BuildAntAppManager extends BuildManager {

    /**
     * @override
     */
    initProcessor(buildConf) {
        super.initProcessor(buildConf);

        const nativeOpts = buildConf.native;
        const defaultBabelProcessorName = getDefaultBabelProcessor(
            buildConf.processors
        );

        // register native swan processor
        if (nativeOpts !== false) {
            initNativeAntProcessor(nativeOpts, defaultBabelProcessorName);
        }
    }
}

module.exports = BuildAntAppManager;
