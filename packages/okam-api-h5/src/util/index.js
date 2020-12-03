
/**
 * @file utilities
 * @author magicchewl@gmail.com
 */

/**
 * excute callback function
 *
 * @param {Function} fn the callback function
 * @param {Any} params tha params of the callback function
 * @return {Any}
 */
export function callback(fn, params) {
    return typeof fn === 'function' && fn(params);
}

/**
 * Judging whether it is an object
 *
 * @param {any} val value
 * @return {boolean}
 */
export function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
}

/**
 * Extend object
 *
 * @param {...Object} args list
 * @return {Object} object
 */
export function extend(...args) {
    let arr = Array.prototype.slice.call(args);
    let org = arr.shift();
    arr.forEach(function (obj) {
        let o = obj || {};
        Object.getOwnPropertyNames(o).forEach(function (key) {
            if (isObject(o[key]) && isObject(org[key])) {
                extend(org[key], o[key]);
            }
            else {
                if (o[key] !== undefined) {
                    org[key] = o[key];
                }
            }
        });
    });
    return org;
}

/**
 * get query string
 *
 * @param {Object} obj query object
 * @return {string} query string
 */
export function getQueryStr(obj) {
    if (isObject(obj)) {
        return Object.getOwnPropertyNames(obj)
            .map(key => `${key}=${obj[key]}`)
            .join('&');
    }
    return '';
}
