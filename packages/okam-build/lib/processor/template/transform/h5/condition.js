/**
 * @file Transform Vue condition syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const CONDITION_MAP = {
    'if': 'v-if',
    'elif': 'v-else-if',
    'else-if': 'v-else-if',
    'else': 'v-else'
};

module.exports = function (attrs, name, tplOpts, opts) {
    const {logger, file} = tplOpts;
    const newName = CONDITION_MAP[name] || name;

    if (newName !== name && attrs.hasOwnProperty(newName)) {
        logger.warn(`${file.path} template attribute ${name} is conflicted with ${newName}`);
    }

    attrs[newName] = attrs[name];
    if (newName !== name) {
        delete attrs[name];
    }
};
