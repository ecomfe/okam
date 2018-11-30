/**
 * @file 解析 for 循环的 key
 * @author zhoudan03
 */

module.exports = function (attrs, name, tplOpts, opts, element) {
    let {logger, file} = tplOpts;
    let {forKeyDirectiveName} = opts;
    let itemName = element.forItemName || 'item';
    let value = attrs[name];

    let keyPrefix = itemName + '.';
    if (value === itemName) {
        value = '*this';
    }
    else if (value.startsWith(keyPrefix)) {
        value = value.substr(keyPrefix.length);
    }

    if (attrs.hasOwnProperty(forKeyDirectiveName)) {
        logger.warn(
            `${file.path} template attribute ${name} is conflicted with`
            + ` ${forKeyDirectiveName}`
        );
    }

    attrs[forKeyDirectiveName] = value;
    delete attrs[name];
};
