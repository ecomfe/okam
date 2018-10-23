/**
 * @file transform data binding
 * @author sparklewhy@gmail.com  sharonzd
 * @date 2018/8/7
 */

'use strict';

const DATA_BIND_REGEXP = require('./constant').DATA_BIND_REGEXP;

// :attr=value   ->    attr={{value}}
module.exports = function (attrs, name, tplOpts) {
    let {logger, file} = tplOpts;
    let newName = name.replace(DATA_BIND_REGEXP, '');
    let value = attrs[name];
    if (typeof value === 'string') {
        value = '{{' + value.trim() + '}}';
    }

    if (attrs.hasOwnProperty(newName)) {
        logger.warn(`${file.path} template attribute ${name} is conflicted with ${newName}`);
    }

    delete attrs[name];
    attrs[newName] = value;
};
