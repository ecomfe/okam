/**
 * @file Transform quick app for key syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

module.exports = function (attrs, name, tplOpts, opts, element) {
    let {logger, file} = tplOpts;
    let value = attrs[name];
    let itemName = element.forItemName;

    let keyPrefix = itemName + '.';
    if (value.startsWith(keyPrefix)) {
        value = value.substr(keyPrefix.length);
    }

    let newName = 'tid';
    if (attrs.hasOwnProperty(newName)) {
        logger.warn(`${file.path} template attribute ${name} is conflicted with ${newName}`);
    }
    delete attrs[name];

    attrs[newName] = value;
};

