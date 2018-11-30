/**
 * @file The entrance of the build
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('./BuildManager');
const runBuild = require('./run-build');
const initBuildOptions = require('./init-build-options');
const createWatcher = require('../watch');
const yargsParser = require('yargs-parser');

function startFileChangeMonitor(buildConf, buildManager) {
    let monitor = createWatcher(buildConf, buildManager);
    if (monitor) {
        monitor.start();
    }
}

function startDevServer(buildConf, buildManager) {
    let serverConf = buildConf.server;
    if (!serverConf) {
        return;
    }

    let {logger, root} = buildManager;
    let createServer = require('../server');
    let server = createServer(Object.assign({logger, root}, serverConf));
    server.start();
}

/**
 * Start to build small application code to native small application code.
 *
 * @param {Object} buildConf the config to build
 * @param {boolean} clear whether clear the old build output before start build
 * @return {Promise}
 */
function startBuild(buildConf, clear) {
    // init build manager
    let buildManager = BuildManager.create(buildConf.appType, buildConf);

    if (clear) {
        buildManager.clear();
    }

    startDevServer(buildConf, buildManager);
    let doneHandler = function () {
        startFileChangeMonitor(buildConf, buildManager);
    };

    // run build
    return runBuild(buildConf, buildManager).then(
        doneHandler,
        doneHandler
    );
}

function main(appType, options) {
    // init build config
    let cliOpts = yargsParser(process.argv.slice(2));
    let buildConf = initBuildOptions(appType, options, cliOpts);

    let {logger} = buildConf;
    try {
        startBuild(buildConf, cliOpts.clean);
    }
    catch (ex) {
        logger.error(ex.message || ex.toString());
        logger.error(ex.stack);
    }
}

module.exports = exports = main;
