/**
 * @file The entrance of the build
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('./BuildManager');
const runBuild = require('./run-build');
const initBuildOptions = require('./init-build-options');
const cleanBuild = require('./clean-build');
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
 * @return {Promise}
 */
function startBuild(buildConf) {
    // init build manager
    let buildManager = new BuildManager(buildConf);

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

    let {logger, output: outputOpts} = buildConf;
    let {dir: outputDir, pathMap: outputPathMap} = outputOpts;

    if (cliOpts.clean) {
        logger.info('clean old build output...');

        let projectConfig = outputPathMap.projectConfig;
        let keepFilePaths = projectConfig ? [projectConfig] : [];
        cleanBuild({
            outputDir,
            keepFilePaths
        });
    }

    startBuild(buildConf);
}

module.exports = exports = main;
