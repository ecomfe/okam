/**
 * @file OKAM build hook
 * @author sparklewhy@gmail.com
 */

'use strict';

const {spawn} = require('child_process');

function parseCmdArgs(cmd) {
    let parts = cmd.split(' ');
    let cmdName = parts.shift();
    let args = parts.map(item => item.trim()).filter(item => item);

    return {cmd: cmdName, args};
}

function getCommandExecuteInfo(command, logger) {
    let cmd;
    let args;
    let options;
    if (command && typeof command === 'object') {
        cmd = command.cmd;
        args = command.args;
        options = command.options;
    }

    if (typeof cmd === 'string' && !args) {
        let result = parseCmdArgs(cmd);
        cmd = result.cmd;
        args = result.args;
    }

    if (cmd && typeof cmd !== 'string') {
        logger.warn('illegal script command', command);
        return;
    }

    return {
        cmd,
        args,
        options
    };
}

function executeCommand(command, logger) {
    let cmdInfo = getCommandExecuteInfo(command, logger);
    if (!cmdInfo) {
        return;
    }

    let {cmd, args, options} = cmdInfo;
    options = Object.assign({
        stdio: 'inherit'
    }, options);
    logger.debug('run command', cmd, args, options);

    let cp = args
        ? spawn(cmd, args, options)
        : spawn(cmd, options);

    return new Promise((resolve, reject) => {
        cp.on('close', code => resolve(code));
        cp.on('error', err => {
            logger.error(
                'execute command error',
                cmd, args, options,
                err.message || err.toString()
            );
            reject(err);
        });
    });
}

function executeBuildCallback(buildManager, listener) {
    let result = listener;
    let {buildConf, logger} = buildManager;
    let {watch: isWatchMode} = buildConf;

    if (typeof listener === 'function') {
        result = listener({watch: isWatchMode});
        if (!result) {
            return;
        }
    }

    if (Array.isArray(result)) {
        return Promise.all(result.map(item => executeCommand(item, logger)));
    }

    return executeCommand(result, logger);
}

exports.runBuildStartHook = function (buildManager, onBuildStart) {
    if (!onBuildStart) {
        return;
    }

    return executeBuildCallback(
        buildManager, onBuildStart
    );
};

exports.runBuildDoneHook = function (buildManager, onBuildDone) {
    if (!onBuildDone) {
        return;
    }

    return executeBuildCallback(
        buildManager, onBuildDone
    );
};
