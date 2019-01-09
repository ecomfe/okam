/**
 * @file Baidu swan mini program build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');
const initNativeSwanProcessor = require('./init-native-swan-processor');
const initWx2SwanProcessor = require('./init-wx2swan-processor');
const {registerProcessor} = require('../../processor/type');
const swanPlugin = require('../../processor/template/plugins/native/swan-plugin');

class BuildSwanAppManager extends BuildManager {

    /**
     * @override
     */
    initProcessor(buildConf) {
        super.initProcessor(buildConf);

        const nativeOpts = buildConf.native;
        const defaultBabelProcessorName = this.defaultBabelProcessorName;

        // register native swan processor
        if (nativeOpts !== false) {
            initNativeSwanProcessor(nativeOpts, defaultBabelProcessorName);
        }

        // register wx2swan processors
        let wx2swanOpts = buildConf.wx2swan;
        if (wx2swanOpts) {
            initWx2SwanProcessor(wx2swanOpts, defaultBabelProcessorName);
        }

        registerProcessor({
            name: 'nativeView',
            processor: 'view',
            extnames: ['swan'],
            options: {
                keepOriginalContent: true,
                plugins: [swanPlugin]
            }
        });
    }
}

module.exports = BuildSwanAppManager;
