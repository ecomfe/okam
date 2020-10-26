/**
 * @file Log utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

const readline = require('readline');
const colors = require('chalk');

/* eslint-disable no-console */
const LOG_LEVEL = {
    debug: {
        id: 0,
        prefix: '[DEBUG]',
        color: colors.gray,
        erasable: true
    },
    trace: {
        id: 1,
        prefix: '[TRACE]',
        color: colors.white,
        erasable: true
    },
    info: {
        id: 2,
        prefix: '[INFO]',
        color: colors.green,
        erasable: true
    },
    warn: {
        id: 3,
        prefix: '[WARN]',
        color: colors.yellow.bold
    },
    error: {
        id: 4,
        prefix: '[ERROR]',
        color: colors.red
    }
};
/* eslint-enable no-console */

/**
 * Erasable log
 *
 * @inner
 * @param {string} msg the message to log
 * @param {boolean} erasable whether to erase the current line before log new message
 */
function erasableLog(msg, erasable) {
    // clear line and move caret position to line start
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);

    process.stdout.write(msg);

    if (!erasable) {
        // start new line if not erasable
        process.stdout.write('\n');
    }
}

class Logger {

    /**
     * Create logger instance
     *
     * @param {Object} options the options
     * @param {string=} options.prefix the log prefix
     * @param {string=} options.level the minimum log level to print
     * @param {boolean=} options.erasable whether to erase the previous log
     */
    constructor(options = {}) {
        this.setLogPrefix(options.prefix);
        this.setLogLevel(options.level);

        this.erasable = !!options.erasable;
    }

    /**
     * Setting the log prefix when logging
     *
     * @param {string} prefix the log prefix to set
     */
    setLogPrefix(prefix) {
        this.logPrefix = prefix || '';
    }

    /**
     * Setting the minimum log level to print, by default `info`
     * The log level weight:
     * debug < trace < info < warn < error
     *
     * @param {string} level the minimum level to print
     */
    setLogLevel(level) {
        level && (level = String(level).toLowerCase());

        if (!level || !LOG_LEVEL[level]) {
            let currEnv = process.env.NODE_ENV;
            let isDebugEnv = currEnv === 'dev' || currEnv === 'development';
            level = isDebugEnv ? 'debug' : 'info';
        }

        this.logLevel = LOG_LEVEL[level].id;
    }

    /**
     * Print log info
     *
     * @private
     * @param {string} logPrefix the log prefix
     * @param {string} logLevel the log level
     * @param  {...any} args the log args
     */
    doLog(logPrefix, logLevel, ...args) {
        let msg = args.map(
            item => {
                if (item && typeof item === 'object') {
                    try {
                        return JSON.stringify(item);
                    }
                    catch (ex) {
                        return item;
                    }
                }
                return item;
            }
        ).join(' ');

        let logType = LOG_LEVEL[logLevel];
        let params = [
            logType.color(logType.prefix),
            logType.color(msg)
        ];

        if (logPrefix) {
            params.unshift(colors.bold(logPrefix));
        }

        erasableLog(
            params.join(' '),
            !this.erasableClosed && this.erasable && logType.erasable
        );
    }

    /**
     * Close erasable support
     */
    closeErasable() {
        this.erasableClosed = true;
    }

    /**
     * Open erasable support
     */
    openErasable() {
        this.erasableClosed = false;
    }

    /**
     * Print the specified level info
     *
     * @param {string} logLevel the log level to print
     * @param {...*} msg the msg to print
     */
    log(logLevel, ...msg) {
        let logType = LOG_LEVEL[logLevel];
        if (logType.id < this.logLevel) {
            return;
        }

        this.doLog(this.logPrefix, logLevel, ...msg);
    }

    /**
     * Print `debug` level info
     *
     * @param {...*} args the args to print
     */
    debug(...args) {
        this.log('debug', ...args);
    }

    /**
     * Print `trace` level info
     *
     * @param {...*} args the args to print
     */
    trace(...args) {
        this.log('trace', ...args);
    }

    /**
     * Print `info` level info
     *
     * @param {...*} args the args to print
     */
    info(...args) {
        this.log('info', ...args);
    }

    /**
     * Print `warn` level info
     *
     * @param {...*} args the args to print
     */
    warn(...args) {
        this.log('warn', ...args);
    }

    /**
     * Print `error` level info
     *
     * @param {...*} args the args to print
     */
    error(...args) {
        this.log('error', ...args);
    }

    /**
     * Create logger
     *
     * @param {Object} options the creation options
     * @return {Logger}
     */
    static create(options) {
        return new Logger(options);
    }
}

module.exports = exports = new Logger();

exports.Logger = Logger;

/* eslint-disable fecs-camelcase */
let _instance = null;

exports.getLogger = function (options) {
    if (!_instance) {
        _instance = new Logger(options);
    }
    return _instance;
};

exports.create = Logger.create;
