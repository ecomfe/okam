/**
 * @file The json5 parser
 * @author sparklewhy@gmail.com
 */

'use strict';

const json5 = require('json5');

/**
 * Compile the file using json5
 *
 * @param {Object} file the file to process
 * @param {Object} options the compile options
 * @return {{content: string}}
 */
function compile(file, options) {
    let obj = json5.parse(file.content.toString());
    let result = JSON.stringify(obj, null, 4);

    return {
        content: result
    };
}

module.exports = exports = compile;

