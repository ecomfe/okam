/**
 * @file Run app build
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const path = require('path');
const {colors, Timer} = require('../util');
const {runBuildStartHook, runBuildDoneHook} = require('./build-hook');

function getRelativePath(absPath) {
    let cwd = process.cwd();
    let relPath = path.relative(cwd, absPath);
    return relPath || path.basename(absPath);
}

function buildDone(timer, logger, outputDir) {
    logger.info(
        'output files to',
        colors.cyan(path.relative(process.cwd(), outputDir)),
        'done:',
        colors.grey(timer.tick())
    );
    logger.info('build done:', colors.grey(timer.elapsedTime()));
}

/**
 * 构建
 *
 * @param {Object} timer         计时器实例
 * @param {Object} buildConf     构建配置
 * @param {Object} buildManager  构建实例
 * @return {Promise}
 */
function buildProject(timer, buildConf, buildManager) {
    let {logger, output: outputOpts} = buildConf;
    let {onBuildStart, onBuildDone} = buildConf.script || {};

    let hookResult = runBuildStartHook(buildManager, onBuildStart);
    let buildResult;
    if (hookResult instanceof Promise) {
        buildResult = hookResult.then(code => {
            logger.debug('init build start done...', code);
            return buildManager.build(timer);
        });
    }
    else {
        buildResult = buildManager.build(timer);
    }

    let doneHandler = buildDone.bind(null, timer, logger, outputOpts.dir);
    return buildResult.then(
        () => buildManager.release()
    ).then(
        doneHandler
    ).then(
        () => {
            runBuildDoneHook(buildManager, onBuildDone);
        }
    ).catch(doneHandler);
}

/**
 * 开始构建
 *
 * @param {Object} buildConf     构建配置
 * @param {Object} buildManager  类BuildManager的实例
 * @return {Promise}
 */
function runBuild(buildConf, buildManager) {
    let timer = new Timer();
    timer.start();

    let {appType, logger, root: rootDir, configPath} = buildConf;

    logger.info('build start...');
    logger.info('build app type:', colors.cyan(appType));
    logger.info(
        'load process files from',
        colors.cyan(getRelativePath(rootDir))
    );

    if (configPath) {
        logger.info(
            'build by config',
            colors.cyan(getRelativePath(configPath))
        );
    }
    else if (buildConf.useDefaultConfig) {
        logger.info('build using default inner config');
    }

    // load build files
    let result = buildManager.loadFiles();
    if (!(result instanceof Promise)) {
        result = Promise.resolve();
    }

    return result.then(() => {
        logger.info('load process files done, file count:',
            colors.cyan(buildManager.getProcessFileCount()) + ', load time:',
            colors.gray(timer.tick())
        );
        logger.info('build for', colors.cyan(buildManager.getBuildEnv()), 'env');

        return buildProject(timer, buildConf, buildManager);
    });
}

module.exports = exports = runBuild;
