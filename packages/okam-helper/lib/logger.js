/**
 * @file Log utitlies
 * @author sparklewhy@gmail.com
 */

'use strict';

const colors = require('chalk');
const util = require('./string');

/* eslint-disable no-console */
const LOG_LEVEL = {
    debug: {
        id: 0,
        prefix: '[DEBUG]',
        color: colors.gray
    },
    trace: {
        id: 1,
        prefix: '[TRACE]',
        color: colors.white
    },
    info: {
        id: 2,
        prefix: '[INFO]',
        color: colors.green
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

function doLog(logPrefix, logLevel, ...args) {
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

    console.log.apply(console, params);
}

class Logger {

    /**
     * 创建 logger 实例
     *
     * @param {Object} options 选项
     * @param {string=} options.prefix 打印 log 自定义前缀
     * @param {string=} options.level 打印 log level
     */
    constructor(options = {}) {
        this.setLogPrefix(options.prefix);
        this.setLogLevel(options.level);
    }

    /**
     * 设置打印 log 前缀
     *
     * @param {string} prefix 打印的日志添加的前缀
     */
    setLogPrefix(prefix) {
        this.logPrefix = prefix || '';
    }

    /**
     * 设置打印 log 的层级，默认打印层级为 `info`
     * log层级大小定义：
     * debug > trace > info > warn > error
     *
     * @param {string} level 要打印的层级，所有低于给定层级都不打印
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
     * 打印日志
     *
     * @param {string} logLevel 日志 level
     * @param {...*} msg 要打印的日志消息
     */
    log(logLevel, ...msg) {
        let logType = LOG_LEVEL[logLevel];
        if (logType.id < this.logLevel) {
            return;
        }

        doLog(this.logPrefix, logLevel, ...msg);
    }

    /**
     * 打印 debug 信息
     *
     * @param {...*} args 打印的信息参数
     */
    debug(...args) {
        this.log('debug', ...args);
    }

    /**
     * 打印 trace 信息
     *
     * @param {...*} args 打印的信息参数
     */
    trace(...args) {
        this.log('trace', ...args);
    }

    /**
     * 打印 info 信息
     *
     * @param {...*} args 打印的信息参数
     */
    info(...args) {
        this.log('info', ...args);
    }

    /**
     * 打印 warn 信息
     *
     * @param {...*} args 打印的信息参数
     */
    warn(...args) {
        this.log('warn', ...args);
    }

    /**
     * 打印 error 信息
     *
     * @param {...*} args 打印的信息参数
     */
    error(...args) {
        this.log('error', ...args);
    }

    /**
     * 创建 logger 工具
     *
     * @param {Object} options 创建选项
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
