/**
 * @file Build options initialize
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const {merge, logger: defaultLogger, file: fileUtil} = require('../util');
const initTransformTags = require('./init-transform-options');
const normalizePolyfill = require('../polyfill/normalize');

/**
 * 获取默认构建配置文件
 *
 * @param {string} appType the type of mini application
 * @return {Object} get default config from 'lib/config/swan'
 */
function getDefaultBuildConfig(appType) {
    switch (appType) {
        case 'swan':
            return require('../config/swan');
        case 'wx':
            return require('../config/wx');
        case 'ant':
            return require('../config/ant');
        default:
            throw new Error('unknown app type, currently only support `swan` for baidu mini program '
                + 'and `wx` for weixin mini program');
    }
}

function getUserBuildConfig(config, appType, confPath) {
    let cwd = process.cwd();
    if (confPath && typeof confPath === 'string') {
        confPath = path.resolve(cwd, confPath);
        config = require(confPath);
    }
    else if (!config) {
        // try to find the user config file by the path:
        // `<cwd>/scripts/<appType>.config.js`
        let userConfPath = path.join(cwd, 'scripts', `${appType}.config.js`);
        if (fileUtil.isFileExists(userConfPath)) {
            config = require(userConfPath);
        }
    }

    config || (config = {useDefaultConfig: true});
    config.configPath = confPath;
    return config;
}

function initLogger(logger, logLevel, options) {
    if (!logger) {
        if (options && options.verbose) {
            logLevel = 'debug';
        }
        else if (!logLevel) {
            logLevel = 'info';
        }

        logger = defaultLogger.create({
            prefix: 'okam',
            level: logLevel
        });
    }
    return logger;
}

/**
 * Initialize build options
 * 初始化构建配置
 *
 * @param {string} appType the small application type to build, by default `swan`
 * @param {Object} options the options to build，the detail options info, please
 *        refer to lib/config/base.js
 * @param {boolean=} options.verbose whether to log detail build info,
 *        by default `false`
 * @param {Object=} cliOpts extra cli options
 * @param {boolean=} cliOpts.watch whether to watch file changes and auto build
 *        when file changes, by default false.
 * @param {boolean=} cliOpts.server whether to start dev server, by default false.
 * @param {number=} cliOpts.port the port of the dev server to listen
 * @param {boolean=} cliOpts.clean whether to clean the old build output except
 *        project config file
 * @param {string=} cliOpts.type the app type to build, the priority is higher
 *        than the param appType
 * @param {string=} cliOpts.config the custom build config file path relatived
 *        to execution path, the priority is higher than the param options
 * @return {Object}
 */
function initBuildOptions(appType, options, cliOpts = {}) {
    appType = cliOpts.type || appType || 'swan';
    let userConfig = getUserBuildConfig(
        options, appType, cliOpts.config
    );

    // merge user config with default config
    let buildConf = getDefaultBuildConfig(appType);
    buildConf = merge({}, buildConf, userConfig, {appType});

    let {watch: watchMode, server: serverMode, port} = cliOpts || {};
    if (watchMode) {
        !buildConf.watch && (buildConf.watch = true);
    }
    else {
        buildConf.watch = false;
    }

    if (serverMode) {
        port && (port = parseInt(port, 10));
        let serverConf = buildConf.server || {};
        port && (serverConf.port = port);
        buildConf.server = serverConf;
    }
    else {
        buildConf.server = false;
    }

    const rootDir = buildConf.root || process.cwd();
    buildConf.root = rootDir;

    // init output config
    let outputOpts = buildConf.output;
    let outputDir = path.resolve(rootDir, outputOpts.dir || 'dist');
    buildConf.output = Object.assign({}, outputOpts, {dir: outputDir});

    // init logger
    let {logger, logLevel} = buildConf;
    buildConf.logger = initLogger(logger, logLevel, userConfig);

    // add logger to global
    if (!global.okamLogger) {
        global.okamLogger = buildConf.logger;
    }

    // init polyfill options
    let {localPolyfill, polyfill} = buildConf;
    let polyfillConf = normalizePolyfill(
        localPolyfill || polyfill, rootDir, buildConf.logger
    );
    buildConf[localPolyfill ? 'localPolyfill' : 'polyfill'] = polyfillConf;

    // 获取模板的配置并将其转化一遍
    let templateConf = buildConf.component && buildConf.component.template;
    if (templateConf && templateConf.transformTags) {
        templateConf.transformTags = initTransformTags(templateConf.transformTags);
    }

    return buildConf;
}

module.exports = initBuildOptions;
