/**
 * @file Alipay ant mini program build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');
const initNativeAntProcessor = require('./init-native-ant-processor');

class BuildAntAppManager extends BuildManager {

    /**
     * @override
     */
    initProcessor(buildConf) {
        super.initProcessor(buildConf);

        // register native swan processor
        let nativeOpts = buildConf.native;
        if (nativeOpts !== false) {
            initNativeAntProcessor(nativeOpts, this.defaultBabelProcessorName);
        }
    }
}

module.exports = BuildAntAppManager;
