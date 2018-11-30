/**
 * @file Url util
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * Parse url query string to query object
 *
 * @param {string} queryStr the query string without containing leading `?`
 * @return {Object}
 */
export function parseQuery(queryStr) {
    let query = {};
    if (!queryStr) {
        return query;
    }

    let parts = queryStr.split('&');
    parts.forEach(item => {
        let arr = item.split('=');
        let key = decodeURIComponent(arr.shift());
        if (arr.length === 0) {
            query[key] = true;
        }
        else {
            let value = decodeURIComponent(arr.join('='));
            query[key] = value;
        }
    });

    return query;
}

