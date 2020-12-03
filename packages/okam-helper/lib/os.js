/**
 * @file OS utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

exports.getUserHomeDir = function () {
    const os = require('os');
    return os.homedir();
};
