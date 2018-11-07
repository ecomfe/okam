/**
 * @file wx to swan
 * @author xiaohong8023@outlook.com
 */

'use strict';

const {registerProcessor} = require('../processor/type');
const wxmlPlugin = require('../processor/template/plugins/wx2swan-syntax-plugin');
const wxssPlugin = require('../processor/css/plugins/postcss-plugin-wx2swan');
const jsPlugin = require('../processor/js/plugins/babel-wx2swan-plugin');
const adapterPlugin = require('../processor/js/plugins/babel-native-swan-plugin');

/**
 * Initialize wx component js processor
 *
 * @inner
 * @param {Object=} opts the options to init
 * @param {string=} opts.processor the builtin processor name, by default `babel`
 * @param {Array=} opts.plugins the processor plugins
 */
function initJsProcessor(opts) {
    let plugins = (opts && opts.plugins) || [jsPlugin, adapterPlugin];
    registerProcessor({
        name: (opts && opts.processor) || 'babel', // override existed processor
        hook: {
            before(file, options) {
                if (file.isWxCompScript && !adapterPlugin.isAdapterModule(file.path)) {
                    options.plugins || (options.plugins = []);
                    options.plugins.push.apply(options.plugins, plugins);
                }
            }
        }
    });
}

/**
 * Initialize wx tpl processor
 *
 * @inner
 * @param {Object=} opts the processor options
 * @param {Array=} opts.plugins the view processor plugins
 */
function initTplProcessor(opts) {
    registerProcessor({
        name: 'wxml2swan',
        processor: 'view', // using the existed view processor
        extnames: ['wxml'],
        rext: 'swan',
        options: opts || {
            plugins: [
                wxmlPlugin
            ]
        }
    });
}

/**
 * Initialize wx style processor
 *
 * @inner
 * @param {Object=} opts the processor init options
 * @param {Array=} opts.plugins the postcss plugins
 */
function initStyleProcessor(opts) {
    registerProcessor({
        name: 'wxss2css',
        processor: 'postcss', // using the existed postcss processor
        extnames: ['wxss'],
        rext: 'css',
        options: opts || {
            plugins: [
                wxssPlugin
            ]
        }
    });
}

/**
 * Init wx2swan processors
 *
 * @param {Object=} options the initialization options
 * @param {Object=} options.js the wx component js processor init options
 * @param {Object=} options.css the wx component style processor init options
 * @param {Object=} options.tpl the wx template processor init options
 */
function initProcessor(options = {}) {
    let {js, css, tpl} = options;

    if (tpl !== false) {
        initTplProcessor(tpl);
    }

    if (css !== false) {
        initStyleProcessor(css);
    }

    if (js !== false) {
        initJsProcessor(js);
    }
}

module.exports = initProcessor;
