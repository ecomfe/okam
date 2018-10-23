/**
 * @file transform condition syntax
 *
 * @author sharonzd
 * @date 2018/8/7
 */

'use strict';

module.exports = function (conditionMap, attrs, name, tplOpts) {
    const {logger, file} = tplOpts;
    const newName = conditionMap[name];

    if (attrs.hasOwnProperty(newName)) {
        logger.warn(`${file.path} template attribute ${name} is conflicted with ${newName}`);
    }

    attrs[newName] = attrs[name];

    delete attrs[name];
};
