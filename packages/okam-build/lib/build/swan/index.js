/**
 * @file Baidu swan mini program build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');
const initNativeSwanProcessor = require('./init-native-swan-processor');
const initWx2SwanProcessor = require('./init-wx2swan-processor');
const {getDefaultBabelProcessor} = require('../../processor/helper/processor');

class BuildSwanAppManager extends BuildManager {

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
            initNativeSwanProcessor(nativeOpts, defaultBabelProcessorName);
        }

        // register wx2swan processors
        let wx2swanOpts = buildConf.wx2swan;
        if (wx2swanOpts) {
            initWx2SwanProcessor(wx2swanOpts, defaultBabelProcessorName);
        }
    }
}

module.exports = BuildSwanAppManager;
