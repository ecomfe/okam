/**
 * @file Template ref attribute transform plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const hash = require('hash-sum');

function initRefInfo(refId, refInfo, file, logger) {
    let refs = file.refs || {};
    file.refs = refs;

    if (refs.hasOwnProperty(refId)) {
        logger.warn(`repeated ref id ${refId} existed in ${file.path}`);
    }
    else {
        refs[refId] = refInfo;
    }
}

function isRefInForContext(element) {
    if (!element) {
        return false;
    }

    if (element.hasForLoop) {
        return true;
    }

    return isRefInForContext(element.parent);
}

module.exports = {

    /**
     * Transform element node ref attribute
     *
     * @param {Object} element the element node to transform
     * @param {Object} tplOpts the template transform options
     * @param {Object=} options the plugin options, optional
     */
    tag(element, tplOpts) {
        let attrs = element.attribs;
        let refValue = attrs && attrs.ref;
        if (!refValue) {
            return;
        }

        let isForRef = isRefInForContext(element);
        let classValue = attrs.class;
        let {file, logger} = tplOpts;
        let refId = hash(file.path + '?' + refValue);
        let refClass = `ref-${refId}`;
        if (classValue) {
            classValue = refClass + ' ' + classValue;
        }
        else {
            classValue = refClass;
        }

        attrs.class = classValue;
        delete attrs.ref;

        // cache ref info to file
        let refInfo = isForRef
            ? [refClass]
            : refClass;
        initRefInfo(refValue, refInfo, file, logger);
    }
};
