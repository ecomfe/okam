/**
 * @file The location API of the H5 app
 * @author congpeisen
 */

'use strict';

/* global window */

function callback(fn, data) {
    typeof fn === 'function' && fn(data);
}

export default {

    /**
     * Pay at Baidu cash register
     *
     * @param {Object} options.orderInfo order info
     * @param {Object} options.payUrl order url
     * @param {Function} options.success success callback
     * @param {Function} options.fail fail callback
     * @param {Function} options.complete complete callback
     * @return {Object} promise
     */
    requestPolymerPayment(options) {
        const {
            // orderInfo,
            payUrl,
            success,
            fail,
            complete
        } = options;

        return new Promise((resolve, reject) => {
            // 无法根据orderInfo直接拼出跳转url
            // h5跳转支付链接需由后端请求支付中台返回
            if (payUrl) {
                window.open(payUrl);
                callback(success);
                callback(complete);
                resolve();
            }
            else {
                callback(fail);
                callback(complete);
                reject();
            }
        });
    }
};
