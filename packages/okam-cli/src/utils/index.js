/**
 * @file git
 * @author xiaohong8023@outlook.com
 */

const execSync = require('child_process').execSync;
const os = require('os');
const fs = require('fs-extra');

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

module.exports = {
    getSystemUserName,
    getGitUser,
    isEmptyDir,
    getAuthor
};
