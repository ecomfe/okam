/**
 * @file set page info API for H5 App
 * @author magicchewl@gmail.com
 */

'use strict';

/* global document:false */

import {callback} from './util';

/**
 * append meta tag into head tag
 *
 * @param {string} type the type of meta：keywords|description
 * @param {string} content the content info
 */
function appendMetaTagToHead(type, content) {
    let meta = document.querySelector(`meta[name="${type}"]`);
    if (meta) {
        meta.setAttribute('content', content);
    }
    else {
        meta = document.createElement('meta');
        meta.setAttribute('name', type);
        meta.content = content;
        document.querySelector('head').appendChild(meta);
    }
}



export default {

    /**
     * setPageInfo API
     *
     * @param {Object} options the options
     * @param {string} options.title the title
     * @param {Function} options.keywords the keywords
     * @param {Function} options.description the description
     * @param {Function} options.success the success callback
     * @param {Function} options.fail the fail callback
     * @param {Function} options.complete the complete callback
     */
    setPageInfo(options = {}) {
        const {
            title,
            keywords,
            description,
            success,
            fail,
            complete
        } = options;

        if (!title || !keywords || !description) {
            const errMsg = `lack of ${!title ? 'title' : !keywords ? 'keywords' : 'description'}`;
            callback(fail, errMsg);
            callback(complete, errMsg);
            return;
        }

        document.title = title;
        appendMetaTagToHead('keywords', keywords);
        appendMetaTagToHead('description', description);
        callback(success, 'setPageInfo success');
        callback(complete, 'setPageInfo success');
    }
};
