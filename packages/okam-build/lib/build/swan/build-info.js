/**
 * @file Init okam framework info used for baidu smart program framework
 *       usage statistic
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const fs = require('fs');
const pkgInfo = require('../../../package.json');
const {getVersionAsync, file: fileUtil} = require('../../util');
const {createFile} = require('../../processor/FileFactory');


const OKAM_CLI_VERSION_CMD = 'okam --version';
const FRAMEWORK_INFO_FILE_NAME = '.frameworkinfo';

function getFrameworkInfo(infoFilePath) {
    if (fileUtil.isFileExists(infoFilePath)) {
        try {
            return JSON.parse(fs.readFileSync(infoFilePath).toString());
        }
        catch (ex) {
            return {};
        }
    }
    return {};
}

function initFrameworkInfo(root, projectInfo) {
    let infoFilePath = path.join(root, FRAMEWORK_INFO_FILE_NAME);
    let existedInfo = getFrameworkInfo(infoFilePath);
    return new Promise((resolve, reject) => {
        getVersionAsync(OKAM_CLI_VERSION_CMD, (err, version) => {
            Object.assign(existedInfo, {
                toolName: 'okam',
                toolFrameworkVersion: pkgInfo.version
            });

            if (!existedInfo.toolCliVersion || !err) {
                existedInfo.toolCliVersion = err ? '' : version;
            }

            if (!existedInfo.createTime) {
                let ctime = (projectInfo && projectInfo.createTime) || Date.now();
                existedInfo.createTime = ctime + '';
            }

            let content = JSON.stringify(existedInfo);
            let vf = createFile({
                fullPath: infoFilePath,
                data: content
            }, root);
            fs.writeFileSync(infoFilePath, content);
            resolve({file: vf, frameworkInfo: existedInfo});
        });
    });
}

exports.initFrameworkInfo = initFrameworkInfo;
