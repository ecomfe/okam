/**
 * @file Dev server
 * @author sparklewhy@gmail.com
 */

'use strict';

const customRequire = require('../util').require;
const {normalizeMiddlewares} = require('./helper');

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

/* eslint-disable fecs-camelcase */
let _instance;
function createDevServer(options) {
    if (_instance) {
        return _instance;
    }

    let {port, logger, middlewares, type = 'express', root} = options;
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
