/**
 * @file Transform include/import tpl syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const {PLAIN_OBJECT_REGEXP} = require('../base/constant');
const DATA_ATTR = ':data';

module.exports = function transformTplElement(element, tplOpts) {
    element.name = 'template';

    let {attribs: attrs} = element;
    if (!attrs.hasOwnProperty(DATA_ATTR)) {
        return;
    }

    let dataValue = attrs[DATA_ATTR];
    if (typeof dataValue === 'string') {
        dataValue = dataValue.trim();
        if (PLAIN_OBJECT_REGEXP.test(dataValue)) {
            dataValue = `{${dataValue}}`;
        }
    }

    delete attrs[DATA_ATTR];
    attrs.data = dataValue;
};
