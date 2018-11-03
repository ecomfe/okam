/**
 * @file Transform ant data binding
 *      :attr="value" -> attr="{{value}}"
 *      :attr="{a: 3, b: c}" -> attr="{{a: 3, b: c}}"
 * @author sparklewhy@gmail.com
 */

'use strict';

const {DATA_BIND_REGEXP, PLAIN_OBJECT_REGEXP} = require('../base/constant');

module.exports = function (attrs, name, tplOpts) {
    let {logger, file} = tplOpts;
    let newName = name.replace(DATA_BIND_REGEXP, '');
    let value = attrs[name];
    if (typeof value === 'string') {
        value = value.trim();
        if (PLAIN_OBJECT_REGEXP.test(value)) {
            value = `{${value}}`;
        }
        else {
            value = `{{${value}}}`;
        }
    }

    if (attrs.hasOwnProperty(newName)) {
        logger.warn(`${file.path} template attribute ${name} is conflicted with ${newName}`);
    }

    delete attrs[name];
    attrs[newName] = value;
};
