/**
 * @file Polyfill plugin helper
 * @author sparklewhy@gmail.com
 */

'use strict';

const {createImportDeclaration, removeComments} = require('../transform/helper');

/**
 * Check given the variable name whether need to polyfill
 *
 * @inner
 * @param {string} importName the variable name to polyfill
 * @param {string} name current variable name
 * @param {Object} path the node path
 * @return {boolean}
 */
function shouldPolyfill(importName, name, path) {
    let result;
    if (Array.isArray(importName)) {
        result = importName.some(item => (item === name));
    }
    else {
        result = importName === name;
    }

    // ignore global variable, e.g., Array/Number/Promise etc.
    return result && !path.scope.hasBinding(name, true);
}

/**
 * Import local polyfill variable
 *
 * @param {string|boolean} name the current variable name, or passing `false`
 *        using the `importName`
 * @param {Object} path the node path
 * @param {Object} state the plugin state
 * @param {Object} t the babel type definition
 */
exports.importLocalPolyfill = function (name, path, state, t) {
    let {id, exports: importName} = state.opts.polyfill;
    if (name === false) {
        name = importName;
    }

    if (!shouldPolyfill(importName, name, path)) {
        return;
    }

    let rootPath = path.findParent(p => t.isProgram(p));
    let insertedFlag = `_hasBind${importName}`;
    if (rootPath[insertedFlag]) {
        return;
    }
    rootPath[insertedFlag] = true;

    let bodyPath = rootPath.get('body.0');

    // ensure the inserted import declaration is after the leading comment
    removeComments(t, bodyPath, 'leadingComments');

    bodyPath.insertBefore(
        createImportDeclaration(importName, id, t)
    );
};
