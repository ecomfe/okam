/**
 * @file wx to swan
 * @author xiaohong8023@outlook.com
 */

'use strict';

const {registerProcessor} = require('../../processor/type');
const wxmlPlugin = require('../../processor/template/plugins/syntax/wx2swan-syntax-plugin');
const wxssPlugin = require('../../processor/css/plugins/postcss-plugin-wx2swan');
const jsPlugin = require('../../processor/js/plugins/babel-wx2swan-plugin');
const wxs2filter = require('../../processor/helper/wxs2filter');

/**
 * Initialize wx component js processor
 *
 * @inner
 * @param {Object=} opts the options to init
 * @param {string=} opts.processor the builtin processor name, by default `babel`
 * @param {Array=} opts.plugins the processor plugins
 * @param {string} defaultBabelProcessorName default babel processor name
 */
function initJsProcessor(opts, defaultBabelProcessorName) {
    let plugins = (opts && opts.plugins) || [jsPlugin];
    registerProcessor({
        name: (opts && opts.processor) || defaultBabelProcessorName, // override existed processor
        hook: {
            before(file, options) {
                if (file.isWxCompScript) {
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
        // using the existed view processor
        processor: 'view',
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
        // using the existed postcss processor
        processor: 'postcss',
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
 * Initialize wxs js processor
 *
 * @inner
 * @param {Object=} opts the options to init
 * @param {string=} opts.processor the builtin processor name, by default `babel`
 * @param {Array=} opts.plugins the processor plugins
 * @param {string} defaultBabelProcessorName default babel processor name
 */
function initWxsProcessor(opts, defaultBabelProcessorName) {
    registerProcessor({
        name: 'wxs2filter',
        processor(file, options) {
            let content = file.content.toString();

            return {
                content: wxs2filter(content)
            };
        },
        extnames: ['wxs'],
        rext: 'filter.js'
    });
}


/**
 * Init wx2swan processors
 *
 * @param {Object=} options the initialization options
 * @param {Object=} options.js the wx component js processor init options
 * @param {Object=} options.css the wx component style processor init options
 * @param {Object=} options.tpl the wx template processor init options
 * @param {string} defaultBabelProcessorName default babel processor name
 */
function initProcessor(options = {}, defaultBabelProcessorName) {
    let {js, css, tpl, wxs} = options;

    if (tpl !== false) {
        initTplProcessor(tpl);
    }

    if (css !== false) {
        initStyleProcessor(css);
    }

    if (js !== false) {
        initJsProcessor(js, defaultBabelProcessorName);
    }

    if (wxs !== false) {
        initWxsProcessor(js, defaultBabelProcessorName);
    }
}

module.exports = initProcessor;
