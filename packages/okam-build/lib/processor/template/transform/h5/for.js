/**
 * @file Transform Vue for syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

module.exports = function (attrs, name, tplOpts) {
    let {logger, file} = tplOpts;
    const newName = 'v-for';
    if (attrs.hasOwnProperty(newName)) {
        logger.warn(`${file.path} template attribute ${name} is conflicted with ${newName}`);
    }

    let value = attrs[name].trim();
    let parts = value.split(' ');
    if (parts.length === 1) {
        value = `item in ${value}`;
    }
    attrs[newName] = value;
    delete attrs[name];
};
