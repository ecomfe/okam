/**
 * @file Dev server based on koa2
 * @author sparklewhy@gmail.com
 */

'use strict';

const ServerBase = require('./ServerBase');

class KoaServer extends ServerBase {
    constructor(options) {
        super(options);

        // let Koa = require('koa');
        let Koa = this.serverType;
        this.app = new Koa();
    }
}

module.exports = exports = KoaServer;
