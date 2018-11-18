/**
 * @file Create swan page instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import {createPage} from '../helper/factory';
import {normalizePage} from '../helper/page';
import pageBase from '../base/page';

/**
 * Create the page instance
 *
 * @param {Object} pageInfo the page info
 * @param {Object=} refComponents the component reference used in the page, the
 *        reference information is defined in the template
 * @return {Object}
 */
export default function extendPage(pageInfo, refComponents) {
    return createPage(
        pageInfo,
        pageBase,
        normalizePage,
        refComponents
    );
}
