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
    tag(element, tplOpts, options) {
        let attrs = element.attribs;
        let refValue = attrs && attrs.ref;
        if (!refValue) {
            return;
        }

        let isForRef = isRefInForContext(element);

        let {file, logger} = tplOpts;
        let refId = hash(file.path + '?' + refValue);

        let {useId} = options || {};
        let refIdentifier = `ref-${refId}`;
        let dataRefValue;
        if (useId) {
            let idValue = attrs.id;
            if (idValue) {
                logger.warn('id value', idValue, 'is conflicted with ref in tpl', file.path);
            }
            attrs.id = refIdentifier;

            dataRefValue = `#${refIdentifier}`;
        }
        else {
            let classValue = attrs.class;
            if (classValue) {
                classValue = refIdentifier + ' ' + classValue;
            }
            else {
                classValue = refIdentifier;
            }
            attrs.class = classValue;

            dataRefValue = `.${refIdentifier}`;
            attrs['data-okam-ref'] = isForRef ? `[]${dataRefValue}` : dataRefValue;
        }

        delete attrs.ref;

        let refInfo = isForRef ? [dataRefValue] : dataRefValue;
        initRefInfo(refValue, refInfo, file, logger);
    }
};
