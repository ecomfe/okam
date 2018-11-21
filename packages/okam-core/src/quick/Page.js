/**
 * @file Create quick app page instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import {createPage} from '../helper/factory';
import {normalizePage} from '../helper/page';
import pageBase from './base/page';

/**
 * Normalize the page information
 *
 * @inner
 * @param {Object} pageInfo the page information to normalize
 * @return {Object}
 */
function normalizeQuickAppPage(pageInfo) {
    pageInfo = normalizePage(pageInfo);

    let {data, dataAccessType} = pageInfo;
    if (data && !pageInfo[dataAccessType]) {
        pageInfo[dataAccessType] = data;
        delete pageInfo.data;
    }

    // extract the protected and public data props as the query props
    let queryProps = [];
    if (pageInfo.protected) {
        queryProps = Object.keys(pageInfo.protected);
    }
    if (pageInfo.public) {
        queryProps = queryProps.push.apply(
            queryProps, Object.keys(pageInfo.public)
        );
    }

    let privateData = pageInfo.private;
    privateData || (privateData = pageInfo.private = {});
    // we using `__` suffix as the inner data, as for `_` leading char is not allowed
    // hook the data to the page context is also not allowed, so we need put it
    // to the privateData
    /* eslint-disable fecs-camelcase */
    privateData.queryProps__ = queryProps;

    return pageInfo;
}

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
    return createPage(
        pageInfo,
        pageBase,
        normalizeQuickAppPage,
        options
    );
}
