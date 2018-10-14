/**
 * @file Dev server based on connect
 * @author sparklewhy@gmail.com
 */

'use strict';

const ServerBase = require('./ServerBase');

class ConnectServer extends ServerBase {
    constructor(options) {
        super(options);

        let connect = this.serverType;
        this.app = connect();
    }
}

module.exports = exports = ConnectServer;
