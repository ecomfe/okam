
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
