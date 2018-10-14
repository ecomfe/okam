/**
 * @file The babel7 parser
 * @author sparklewhy@gmail.com
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
    return parserHelper.compile(file, options, 7);
}

module.exports = exports = compile;

