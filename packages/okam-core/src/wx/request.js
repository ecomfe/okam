/**
 * @file Weixn optimized request
 * @author sparklewhy@gmail.com
 */

'use strict';

import naRequest from '../na/request';

const rawRequest = naRequest.request;

/**
 * The waiting to request queues
 *
 * @type {Array}
 */
const waitingQueues = [];

/**
 * The max allow parallel request number
 *
 * @type {number}
 */
let requestMaxNum = 10;

/**
 * The current request number
 *
 * @type {number}
 */
let currRequestNum = 0;

/**
 * Do request
 *
 * @param {Object} reqOpts the request options
 * @return {Promise}
 */
function doRequest(reqOpts) {
    if (currRequestNum >= requestMaxNum) {
        return new Promise((resolve, reject) => {
            waitingQueues.push({
                options: reqOpts,
                resolve,
                reject
            });
        });
    }

    currRequestNum++;

    let rawComplete = reqOpts.complete;
    reqOpts.complete = function (...args) {
        currRequestNum--;

        rawComplete && rawComplete(...args);

        if (!waitingQueues.length) {
            return;
        }

        let processReqInfo = waitingQueues.shift();
        doRequest(processReqInfo.options).then(
            res => processReqInfo.resolve(res),
            err => processReqInfo.reject(err)
        );
    };

    return rawRequest(reqOpts);
}

/**
 * Set the max allowed request number
 *
 * @param {number} num the max num to set
 */
export function setMaxRequestNumber(num) {
    num = parseInt(num, 10);
    if (num < 1) {
        return;
    }

    requestMaxNum = num;
}

/**
 * Initialize request
 */
export default function init() {
    naRequest.request = function (options) {
        return doRequest(options);
    };
}
