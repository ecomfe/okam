/**
 * @file Weixin mini program build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');
const {getDefaultBabelProcessor} = require('../../processor/helper/processor');
const {registerProcessor} = require('../../processor/type');
const {resolve: resolveDep} = require('../../processor/helper/npm');
const programPlugins = require('../../processor/js/plugins/babel-program-plugins');

class BuildWxAppManager extends BuildManager {

    /**
     * @override
     */
    initProcessor(buildConf) {
        super.initProcessor(buildConf);

        const defaultBabelProcessorName = getDefaultBabelProcessor(
            buildConf.processors
        );

        let self = this;
        registerProcessor({
            name: 'wxs',
            // using the existed view processor
            processor: defaultBabelProcessorName,
            extnames: ['wxs'],
            rext: 'wxs',
            hook: {
                before(file, options) {
                    options.plugins = [
                        [
                            programPlugins.resolveDep,
                            {
                                resolveDepRequireId: resolveDep.bind(null, self, file)
                            }
                        ]
                    ];
                }
            }
        });
    }
}

module.exports = BuildWxAppManager;
