/**
 * @file Server helper
 * @author sparklewhy@gmail.com
 */

'use strict';

const customRequire = require('../util').require;

exports.normalizeMiddlewares = function (mws, root) {
    if (!Array.isArray(mws)) {
        return;
    }

    let result = [];
    let deps = [];
    mws.forEach(item => {
        let name;
        let options;
        if (Array.isArray(item)) {
            name = item[0];
            options = item[1];
        }
        else if (typeof item === 'object') {
            name = item.name;
            options = item.options;
        }
        else if (typeof item === 'function') {
            result.push(item);
            return;
        }
        else {
            // ignore invalidated middlware
            return;
        }

        if (!deps.includes(name)) {
            customRequire.ensure(name, [name], root);
            deps.push(name);
            result.push(customRequire(name, root)(options));
        }
    });

    return result;
};
