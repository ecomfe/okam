/**
 * @file Page helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * Normalize the page information: add methods reference in the page context
 *
 * @param {Object} pageInfo the page information to normalize
 * @return {Object}
 */
export function normalizePage(pageInfo) {
    let methods = pageInfo.methods;
    /* istanbul ignore next */
    if (methods) {
        Object.keys(methods).forEach(k => {
            if (pageInfo.hasOwnProperty(k)) {
                console.warn(`the method ${k} defined in methods existed in page context`);
            }
            pageInfo[k] = methods[k];
        });
    }

    return pageInfo;
}
