/**
 * @file The babel parser helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * Compile the file using babel
 *
 * @param {Object} file the file to process
 * @param {Object} options the compile options
 * @param {number} babelVersion babel the babel main version
 * @return {{content: string, sourceMap: string}}
 */
exports.compile = function (file, options, babelVersion = 6) {
    if (file.disableBabel) {
        return;
    }

    let babel = babelVersion <= 6 ? require('babel-core') : require('@babel/core');
    let config = Object.assign({babelrc: false}, options.config, {filename: file.path});

    // transform code
    let result = file.ast
        ? babel.transformFromAst(file.ast, file.content, config)
        : babel.transform(file.content, config);

    // extract used babel helper api
    let usedHelpers = result.metadata
        && result.metadata.usedHelpers;
    if (usedHelpers) {
        // cache the used babel helper information
        file.babelHelpers = usedHelpers;
    }

    // init source map
    let sourceMaps = config.sourceMaps;
    let sourceMapInfo;
    if (sourceMaps && sourceMaps !== 'inline' && result.map) {
        sourceMapInfo = JSON.stringify(result.map, null, 2);
    }

    return {
        ast: result.ast,
        content: result.code,
        sourceMap: sourceMapInfo
    };
};


