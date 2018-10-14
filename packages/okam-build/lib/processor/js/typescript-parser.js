/**
 * @file The typescript parser
 * @author luxiangqian@baidu.com
 */

'use strict';

const parserHelper = require('./babel-parser-helper');

/**
 * Compile the file using babel
 *
 * @param {Object} file the file to process
 * @param {Object} options the compile options
 * @return {{content: string, sourceMap: string}}
 */
function compile(file, options) {
    let config = options.config || {};
    let presets = config.presets || [];

    let tsPreset = '@babel/preset-typescript';
    if (!presets.includes(tsPreset)) {
        config.presets = [tsPreset].concat(presets);
        options.config = config;
    }

    return parserHelper.compile(file, options, 7);
}

module.exports = exports = compile;

