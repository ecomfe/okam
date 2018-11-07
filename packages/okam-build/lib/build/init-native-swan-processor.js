/**
 * @file Native swan support processor initialization
 * @author sparklewhy@gmail.com
 */

'use strict';

const {registerProcessor} = require('../processor/type');
const adapterPlugin = require('../processor/js/plugins/babel-native-swan-plugin');

/**
 * Initialize native component js processor
 *
 * @inner
 * @param {Object=} opts the options to init
 * @param {string=} opts.processor the builtin processor name, by default `babel`
 * @param {Array=} opts.plugins the processor plugins
 */
function initJsProcessor(opts) {
    let plugins = (opts && opts.plugins) || [adapterPlugin];
    registerProcessor({
        name: (opts && opts.processor) || 'babel', // override existed processor
        hook: {
            before(file, options) {
                if (file.isSwanCompScript && !adapterPlugin.isAdapterModule(file.path)) {
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
 */
function initProcessor(options = {}) {
    let {js} = options;

    if (js !== false) {
        initJsProcessor(js);
    }
}

module.exports = initProcessor;
