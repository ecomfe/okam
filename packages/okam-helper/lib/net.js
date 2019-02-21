/**
 * @file Net utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

const DEFAULT_LOCAL_IP = ['127.0.0.1', 'localhost', '::1'];

/**
 * Get all ipv4 address in local
 *
 * @return {Array.<string>}
 */
exports.getAllLocalIPs = function () {
    let netInterfaces = require('os').networkInterfaces();
    /* eslint-disable fecs-prefer-spread-element */
    let allLocalIPs = [].concat(DEFAULT_LOCAL_IP);

    Object.keys(netInterfaces).forEach(dev => {
        let items = netInterfaces[dev];
        for (let i = 0, len = items.length; i < len; i++) {
            let detail = items[i];
            let ip = detail.address;
            if (detail.family === 'IPv4' && allLocalIPs.indexOf(ip) === -1) {
                allLocalIPs.push(ip);
            }
        }
    });

    return allLocalIPs;
};

/**
 * Get localhost IP
 *
 * @return {string}
 */
exports.getIP = function () {
    let ipList = exports.getAllLocalIPs();
    let found = '127.0.0.1';
    ipList.some(item => {
        if (DEFAULT_LOCAL_IP.indexOf(item) === -1) {
            found = item;
            return true;
        }
        return false;
    });

    return found;
};

