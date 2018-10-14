/**
 * @file wxjs2swanjs transform api
 * @author xiaohong8023@outlook.com
 */

'use strict';

const parserHelper = require('../js/babel-parser-helper');
const wx2swanPlugin = require('../js/plugins/babel-wx2swan-plugin');

/**
 * Compile the file using babel
 *
 * @param {Object} file the file to process
 * @param {Object} options the compile options
 * @return {{content: string, sourceMap: string}}
 */
function compile(file, options) {
    let config = options.config;
    config.plugins = config.plugins || [];
    config.plugins.push([wx2swanPlugin]);

    return parserHelper.compile(file, options);
}

module.exports = exports = compile;

