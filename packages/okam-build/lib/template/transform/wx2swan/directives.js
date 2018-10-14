/**
 * @file wx 指令 转为 swan 指令
 * @author xiaohong8023@outlook.com
 *
 * 属性不需要括号包裹, 去除 {{}}
 * wx: to s-
 */

const {DOUBLE_BRACES_REGEXP} = require('./constant');

const DIRECTIVES_MAP = {
    'wx:if': 's-if',
    'wx:elif': 's-elif',
    'wx:else': 's-else',

    'wx:for': 's-for',
    'wx:for-items': 's-for',
    'wx:for-item': 's-for-item',
    'wx:for-index': 's-for-index',

    // swan don't support
    'wx:key': ''
};

/**
 * 移除指令中的 {{}}
 *
 * @param  {string} value value
 * @return {string}
 */
function removeBraces(value) {
    // wx:else 情况排除
    if (typeof value !== 'string') {
        return value;
    }

    value = value.trim();
    if (DOUBLE_BRACES_REGEXP.test(value)) {
        value = value.slice(2, -2).trim();
    }
    return value;
}

module.exports = function (attrs, name, tplOpts) {
    const {logger, file} = tplOpts;
    const newName = DIRECTIVES_MAP[name];

    if (attrs.hasOwnProperty(newName)) {
        logger.warn(`${file.path} template attribute ${name} is conflicted with ${newName}`);
    }

    newName && (attrs[newName] = removeBraces(attrs[name]));
    delete attrs[name];
};
