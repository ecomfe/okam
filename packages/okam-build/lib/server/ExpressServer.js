/**
 * @file Dev server based on express
 * @author sparklewhy@gmail.com
 */

'use strict';

const ServerBase = require('./ServerBase');

class ExpressServer extends ServerBase {
    constructor(options) {
        super(options);

        let express = this.serverType;
        this.app = express();
    }
}

module.exports = exports = ExpressServer;
