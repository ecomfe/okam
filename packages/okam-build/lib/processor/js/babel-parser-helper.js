/**
 * @file The babel parser helper
 * @author sparklewhy@gmail.com
 */

'use strict';

class Babel7 {
    constructor() {
        this.babel = require('@babel/core');
        this.template = this.babel.template;
    }

    transformFromAst(ast, content, config) {
        return this.babel.transformFromAstSync(ast, content, config);
    }

    transform(content, config) {
        return this.babel.transformSync(content, config);
    }

    generate(...args) {
        let generate = require('@babel/generator').default;
        return generate.apply(null, args);
    }
}

class Babel6 {
    constructor() {
        this.babel = require('babel-core');
        this.template = this.babel.template;
    }

    transformFromAst(ast, content, config) {
        return this.babel.transformFromAst(ast, content, config);
    }

    transform(content, config) {
        return this.babel.transform(content, config);
    }

    generate(...args) {
        let generate = require('babel-generator').default;
        return generate.apply(null, args);
    }
}

let babel6Parser = null;
let babel7Parser = null;

function initBabelParser(babelVersion) {
    let isBabel6 = babelVersion <= 6;
    if (isBabel6 && !babel6Parser) {
        babel6Parser = new Babel6();
    }

    if (!isBabel6 && !babel7Parser) {
        babel7Parser = new Babel7();
    }

    return isBabel6 ? babel6Parser : babel7Parser;
}

/**
 * Init babel parser for test purpose
 *
 * @param {number=} babelVersion the babel version to init
 */
exports.initBabelParser = function (babelVersion) {
    babel7Parser = babel6Parser = null;
    initBabelParser(babelVersion);
};

exports.getBabelParser = function () {
    return babel7Parser || babel6Parser;
};

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

    let babel = initBabelParser(babelVersion);
    let config = Object.assign(
        {babelrc: false, ast: true},
        options.config,
        {filename: file.path}
    );

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
