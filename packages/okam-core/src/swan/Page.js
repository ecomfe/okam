/**
 * @file Create swan page instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import {createPage} from '../helper/factory';
import {normalizePage} from '../helper/page';
import {fixEventObject} from './helper/triggerEvent';
import pageBase from '../base/page';

/**
 * Fix swan 1.12 event arguments upgrade
 *
 * @param {Object} event the event object
 * @return {Object} the new event object
 */
pageBase.methods.__beforeEventProxy = fixEventObject;

/**
 * Create the page instance
 *
 * @param {Object} pageInfo the page info
 * @param {Object=} options the extra init options
 * @param {Object=} options.refs the component reference used in the component, the
 *        reference information is defined in the template
 * @return {Object}
 */
export default function extendPage(pageInfo, options) {
    return createPage(
        pageInfo,
        pageBase,
        normalizePage,
        options
    );
}
