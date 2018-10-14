/**
 * @file Timer
 * @author sparklewhy@gmail.com
 */

'use strict';

const prettyHrtime = require('pretty-hrtime');

class Timer {
    constructor() {
        this.startTime = 0;
        this.lastStartTime = 0;
    }

    start() {
        this.startTime = this.lastStartTime = process.hrtime();
    }

    tick() {
        let endTime = process.hrtime(this.lastStartTime);
        this.lastStartTime = process.hrtime();
        return prettyHrtime(endTime);
    }

    restart() {
        this.start();
    }

    elapsedTime() {
        let endTime = process.hrtime(this.startTime);
        return prettyHrtime(endTime);
    }
}

module.exports = exports = Timer;

