/**
 * @file git
 * @author xiaohong8023@outlook.com
 */

const execSync = require('child_process').execSync;
const os = require('os');
const fs = require('fs-extra');
const path = require('path');

/**
 * 获取系统用户名
 *
 * @return {string}
 */
function getSystemUserName() {
    return os.userInfo().username || '';
}

/**
 * 获取 git 用户名
 *
 * @return {string}
 */
function getGitUser() {
    try {
        let name = execSync('git config --get user.name');
        let email = execSync('git config --get user.email');
        name = name && name.toString().trim();
        email = email && ('<' + email.toString().trim() + '>');
        return (name || '') + (email || '');
    }
    catch (e) {
        return '';
    }
}

/**
 * 获取 用户名
 *
 * @return {string}
 */
function getAuthor() {
    return getGitUser() || getSystemUserName();
}

/**
 * 判断是否为空文件夹
 * . 文件也算不为空
 *
 * @param  {string}  currDir currDir
 * @return {boolean}
 */
function isEmptyDir(currDir) {
    let files = fs.readdirSync(currDir);
    return !files.length;
}

/**
 * 有效文件夹
 *
 * @param  {string}  currDir currDir
 * @return {boolean}
 */
function validateDir(currDir) {
    if (!currDir) {
        return 'The project name can not be empty!';
    }

    if (fs.existsSync(currDir) && (!isEmptyDir(currDir))) {
        return 'The target directory is existed, please change another name！';
    }

    return true;
}

/**
 * 获取给定的文件路径的状态信息
 *
 * @inner
 * @param {string} target 文件的目标路径
 * @return {?Object}
 */
function getFileState(target) {
    try {
        let state = fs.statSync(target);
        return state;
    }
    catch (ex) {
        // ignore
    }
}

/**
 * 遍历当前文件夹下的文件并进行回调操作
 *
 * @param  {string}   curDir 当前的目录
 * @param  {Function} cb callback function
 */
function traverseFilesAndCb(curDir, cb) {
    let fileDirs = [curDir];
    while (fileDirs.length) {
        let currDir = fileDirs.pop();
        let files = fs.readdirSync(currDir);
        for (let i = 0, len = files.length; i < len; i++) {
            let fileName = files[i];

            if (/^\./.test(fileName)) {
                continue;
            }

            let fullPath = path.resolve(currDir, fileName);
            let stat = getFileState(fullPath);
            if (!stat) {
                continue;
            }

            let isDir = stat.isDirectory();
            if (isDir) {
                fileDirs.push(fullPath);
                continue;
            }

            if (typeof cb === 'function') {
                cb(fullPath);
            }
        }
    }
}

module.exports = {
    getSystemUserName,
    getGitUser,
    getAuthor,
    isEmptyDir,
    validateDir,
    getFileState,
    traverseFilesAndCb
};
