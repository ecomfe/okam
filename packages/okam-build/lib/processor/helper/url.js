/**
 * @file Url helper
 * @author sparklewhy@gmail.com
 */

'use strict';

const HTTP_PROTOCOL_REGEXP = /^https?\:\/\//;
const URL_REGEXP = /^[\w\.\/\-]+$/;

function getUrlInfo(url) {
    let queryIdx = url.indexOf('?');
    let pathname = url;
    let search;
    let hash;
    if (queryIdx !== -1) {
        search = url.substr(queryIdx);
        pathname = url.substring(0, queryIdx);
    }
    else {
        let hashIdx = url.indexOf('#');
        if (hashIdx !== -1) {
            hash = url.substr(hashIdx);
            pathname = url.substring(0, hashIdx);
        }
    }

    return {
        pathname,
        search,
        hash
    };
}

exports.resolveUrlPath = function (url, file, resolver, logger) {
    url = url.trim();

    // ignore http url and data base64 resource
    if (HTTP_PROTOCOL_REGEXP.test(url)
        || url.startsWith('data:')
    ) {
        return;
    }

    let {pathname, search, hash} = getUrlInfo(url);
    if (!URL_REGEXP.test(pathname)) {
        logger.debug('cannot resolve resource', url, 'in', file.path);
        return;
    }

    if (pathname.charAt(0) !== '.') {
        pathname = './' + pathname;
    }

    let resolvePath = resolver(file, pathname);
    if (!resolvePath) {
        return;
    }

    return resolvePath + (search || '') + (hash || '');
};
