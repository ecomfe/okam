/**
 * @file Weixin mini program build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');
const {getDefaultBabelProcessor} = require('../../processor/helper/processor');
const {registerProcessor} = require('../../processor/type');

class BuildWxAppManager extends BuildManager {

    /**
     * @override
     */
    initProcessor(buildConf) {
        super.initProcessor(buildConf);

        const defaultBabelProcessorName = getDefaultBabelProcessor(
            buildConf.processors
        );

        registerProcessor({
            name: 'wxs',
            // using the existed view processor
            processor: defaultBabelProcessorName,
            extnames: ['wxs'],
            rext: 'wxs',
            options: {
                plugins: ['dep']
            }
        });
    }
}

module.exports = BuildWxAppManager;
