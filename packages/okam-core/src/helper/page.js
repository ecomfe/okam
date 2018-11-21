/**
 * @file Page helper
 * @author sparklewhy@gmail.com
 */

'use strict';

import {extractMethodsToOuterContext} from './methods';

/**
 * Normalize the page information: add methods reference in the page context
 *
 * @param {Object} pageInfo the page information to normalize
 * @return {Object}
 */
export function normalizePage(pageInfo) {
    return extractMethodsToOuterContext(pageInfo);
}
