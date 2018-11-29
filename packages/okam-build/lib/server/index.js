/**
 * @file Dev server
 * @author sparklewhy@gmail.com
 */

'use strict';

const customRequire = require('../util').require;

const SERVER = {
    koa: {
        path: './KoaServer',
        deps: ['koa']
    },
    express: {
        path: './ExpressServer',
        deps: ['express']
    },
    connect: {
        path: './ConnectServer',
        deps: ['connect']
    }
};

function normalizeMiddlewares(mws, root) {
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
}

/* eslint-disable fecs-camelcase */
let _instance;
function createDevServer(options) {
    if (_instance) {
        return _instance;
    }

    let {port, logger, middlewares, type = 'connect', root} = options;
    port || (port = process.env.PORT || 8080);

    let serverInfo = SERVER[type];
    if (!serverInfo) {
        throw new Error(`unknow server type: ${type}`);
    }

    let deps = serverInfo.deps;
    try {
        customRequire.ensure(type, deps, root);
        middlewares = normalizeMiddlewares(middlewares, root);
    }
    catch (ex) {
        logger.error(ex.stack || ex.toString());
        process.exit(1);
    }

    let Server = require(serverInfo.path);
    let devServer =  new Server({
        port, logger, middlewares, dep: customRequire(deps[0], root)
    });
    _instance = devServer;

    return devServer;
}

module.exports = exports = createDevServer;

exports.getInstance = function () {
    return _instance;
};
