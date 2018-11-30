/**
 * @file Quick app init script
 * @author <author>
 */

'use strict';

const fs = require('fs');
const path = require('path');
const {spawnSync, execSync} = require('child_process');
const rimraf = require('rimraf');

const quickConf = require('./quick.config');
const outputDirPath = quickConf.output.dir;
const outputDir = path.join(__dirname, '..', outputDirPath);

function isDirectoryExists(dir) {
    try {
        return fs.statSync(dir).isDirectory();
    }
    catch (ex) {
        return false;
    }
}

function initQuickAppProject() {
    try {
        let result = execSync('hap -V');
        console.log('Using hap version: ' + result);
    }
    catch (ex) {
        console.error('`hap` 命令不可用，请确认你已经安装了 `hap-toolkit` 快应用开发工具');
    }

    spawnSync('hap', ['init', outputDirPath], {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
    });

    spawnSync('npm', ['install'], {
        stdio: 'inherit',
        cwd: outputDir
    });

    // remove scaffold src directory
    rimraf.sync(path.join(outputDir, 'src'));
}

if (!isDirectoryExists(outputDir)) {
    console.log('\nBegin to init quick app project scaffold for build.');
    initQuickAppProject();
}
