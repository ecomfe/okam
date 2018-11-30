/**
 * @file Files change watch task
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const {colors} = require('../util');
const watchHandler = require('./watch-handler');

function getWatchFilePatterns(buildManager) {
    let {sourceDir, files} = buildManager;
    let watchFiles = [
        sourceDir + '/**/*'
    ];
    let sourceFilePrefix = sourceDir + '/';

    files.forEach(item => {
        let path = item.path;
        if (path.indexOf(sourceFilePrefix) !== 0) {
            watchFiles.push(path);
        }
    });

    return watchFiles;
}

function createFileMonitor(buildConf, buildManager) {
    let {watch, root} = buildConf;
    if (!watch) {
        return;
    }

    let FileMonitor = require('./FileMonitor');
    let monitor = new FileMonitor({
        baseDir: root,
        files: getWatchFilePatterns(buildManager)
    });

    let logger = buildManager.logger;
    monitor.on('ready', () => logger.info(
        colors.cyan('Watch file change start...')
    ));

    monitor.on('watch', (type, file) => {
        logger.info('watch', colors.cyan(type), colors.gray(file));
        let handler = watchHandler[type];
        handler && handler(file, buildManager);
    });

    // init custom watch listener
    if (typeof watch === 'object') {
        Object.keys(watch).forEach(
            k => monitor.on(k, watch[k])
        );
    }

    monitor.start();

    return monitor;
}

module.exports = exports = createFileMonitor;
