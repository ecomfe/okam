/**
 * @file Toutiao mini program build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');
const {registerProcessor} = require('../../processor/type');
const ttmlPlugin = require('../../processor/template/plugins/native/ttml-plugin');

class BuildTTAppManager extends BuildManager {

    /**
     * @override
     */
    initProcessor(buildConf) {
        super.initProcessor(buildConf);
        registerProcessor({
            name: 'nativeView',
            processor: 'view',
            extnames: ['ttml'],
            options: {
                keepOriginalContent: true,
                plugins: [ttmlPlugin]
            }
        });
    }
}

module.exports = BuildTTAppManager;
