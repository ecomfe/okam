/**
 * @file Require utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

const resolve = require('resolve');

const modulePathCache = {};

function resolveModulePath(id, rootDir) {
    if (modulePathCache[id]) {
        return modulePathCache[id];
    }

    let res;
    try {
        res = require.resolve(id);
    }
    catch (e) {
        try {
            res = resolve.sync(id, {basedir: rootDir || process.cwd()});
        }
        catch (e) {
        }
    }

    res && (modulePathCache[id] = res);
    return res;
}

module.exports = exports = function (id, rootDir) {
    let modulePath = resolveModulePath(id, rootDir);
    if (!modulePath) {
        throw 'require ' + id + ' is not found';
    }
    return require(modulePath);
};

/**
 * Make sure the module dependencies is available
 *
 * @param {string} name the dependency name
 * @param {string|Array} deps the detail dependencies list，e.g., ['less'] or 'less'
 *        or ['babel-core', ['babel-runtime', 'babel-runtime/core-js']]
 *        If the array element is an array, the first item is the dependency to install,
 *        and the second item is the entry to require of the dependency.
 *        e.g., the `babel-runtime` is the dep to install, and the `babel-runtime/core-js`
 *        is the entry to require.
 * @param {string} rootDir the root dir
 * @throws Error
 */
exports.ensure = function (name, deps, rootDir) {
    let missing = [];

    if (typeof deps === 'string') {
        deps = [deps];
    }

    for (let i = 0, len = deps.length; i < len; i++) {
        let mis;
        let req = deps[i];
        if (typeof req === 'string') {
            mis = req;
        }
        else {
            req = req[0];
            mis = req[1];
        }

        let result = resolveModulePath(req, rootDir);
        if (!result) {
            missing.push(mis);
        }
    }

    if (missing.length > 0) {
        let message = 'You are trying to use "' + name + '". ';
        let npmInstall = 'npm install --save-dev ' + missing.join(' ');

        if (missing.length > 1) {
            let last = missing.pop();
            message += missing.join(', ') + ' and ' + last + ' are ';
        }
        else {
            message += missing[0] + ' is ';
        }

        message += 'missing.\n\nTo install run:\n' + npmInstall + '\n\n';
        throw new Error(message);
    }
};

