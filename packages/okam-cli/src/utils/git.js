/**
 * @file git
 * @author xiaohong8023@outlook.com
 */

const execSync = require('child_process').execSync;

function getUser() {
    try {
        let name = execSync('git config --get user.name');
        let email = execSync('git config --get user.email');
        name = name && name.toString().trim();
        email = email && ('<' + email.toString().trim() + '>');
        return name + email;
    }
    catch (e) {
        return '';
    }
}

module.exports = {
    getUser
};
