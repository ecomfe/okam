/**
 * @file Dev server base
 * @author sparklewhy@gmail.com
 */

'use strict';

const {net, colors} = require('../util');

class ServerBase {
    constructor({port, logger, middlewares, dep}) {
        this.port = port;
        this.logger = logger;
        this.middlewares = middlewares;
        this.ip = net.getIP();
        this.serverType = dep;
    }

    initMiddlewares() {
        // init middlewares
        let mws = this.middlewares;
        if (mws && !Array.isArray(mws)) {
            mws = [mws];
        }
        mws && mws.forEach(item => this.app.use(item));
    }

    getApp() {
        return this.app;
    }

    getHost() {
        return `http://${this.ip}:${this.port}`;
    }

    start() {
        this.initMiddlewares();
        this.app.listen(this.port, this.onStarted.bind(this));
    }

    onStarted() {
        this.logger.info('DevServer started:', colors.cyan(`http://${this.ip}:${this.port}`));
    }
}

module.exports = exports = ServerBase;
