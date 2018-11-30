/**
 * @file Native ant mini program support processor initialization
 * @author sparklewhy@gmail.com
 */

'use strict';

const {registerProcessor} = require('../../processor/type');
const adapterPlugin = require('../../processor/js/plugins/babel-native-ant-plugin');

/**
 * Initialize native component js processor
 *
 * @inner
 * @param {Object=} opts the options to init
 * @param {string=} opts.processor the builtin processor name, by default `babel`
 * @param {Array=} opts.plugins the processor plugins
 * @param {string} defaultBabelProcessorName default babel processor name
 */
function initJsProcessor(opts, defaultBabelProcessorName) {
    let plugins = (opts && opts.plugins) || [adapterPlugin];
    registerProcessor({
        name: (opts && opts.processor) || defaultBabelProcessorName, // override existed processor
        hook: {
            before(file, options) {
                if (file.isAntCompScript && !adapterPlugin.isAdapterModule(file.path)) {
                    options.plugins || (options.plugins = []);
                    options.plugins.push.apply(options.plugins, plugins);
                }
            }
        }
    });
}

/**
 * Init native transformation processors
 *
 * @param {Object=} options the initialization options
 * @param {Object=} options.js the component js processor init options
 * @param {string} defaultBabelProcessorName default babel processor name
 */
function initProcessor(options = {}, defaultBabelProcessorName) {
    let {js} = options;

    if (js !== false) {
        initJsProcessor(js, defaultBabelProcessorName);
    }
}

module.exports = initProcessor;
