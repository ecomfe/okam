/**
 * @file Create h5 app page instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import {createPage} from '../helper/factory';
import pageBase from './base/page';

/**
 * Create the page instance
 *
 * @param {Object} pageInfo the page info
 * @param {Object=} options the extra init options
 * @param {Object=} options.refs the component reference used in the
 *        component, the reference information is defined in the template
 * @param {string=} options.dataAccessType the data access type
 * @return {Object}
 */
export default function extendPage(pageInfo, options) {
    options || (options = {});
    options.isH5 = true;
    return createPage(
        pageInfo,
        pageBase,
        null,
        options
    );
}
