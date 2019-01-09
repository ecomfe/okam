/**
 * @file Alipay ant mini program build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');
const initNativeAntProcessor = require('./init-native-ant-processor');
const {updateReferProcessorInfo} = require('../../processor/type');
const {registerProcessor} = require('../../processor/type');
const axmlPlugin = require('../../processor/template/plugins/native/axml-plugin');

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

        registerProcessor({
            name: 'nativeView',
            processor: 'view',
            extnames: ['axml'],
            options: {
                keepOriginalContent: true,
                plugins: [axmlPlugin]
            }
        });
    }
}

module.exports = BuildAntAppManager;
