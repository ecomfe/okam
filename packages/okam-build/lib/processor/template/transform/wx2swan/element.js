/**
 * @file Element Transformer
 * @author xiaohong8023@outlook.com
 */

'use strict';

const {FOR_DIRECTIVES, CONDITION_DIRECTIVES} = require('./constant');
const forIfTransform = require('./forIf');

/**
 * src 引入 后缀转换: import and inlcude
 *
 * @param  {Object} element element
 */
function transformExtNameElement(element) {
    let {attribs: attrs} = element;
    let src = attrs && attrs.src;

    if (src) {
        attrs.src = src.replace(/\.wxml$/i, '.swan');
    }
}

/**
 * template data属性转换
 * data 属性 加单 花括号: template
 *
 * @param  {Object} element element
 */
function transformTemplateElement(element) {
    let {attribs: attrs} = element;
    let data = attrs && attrs.data;
    if (data) {
        attrs.data = `{${data}}`;
    }
}

/**
 * for if 并存判断
 *
 * @param  {Object} attrs attrs
 * @return {boolean}
 */
function bothForAndIFAttr(attrs) {
    if (!attrs) {
        return false;
    }

    let hasForAttr = FOR_DIRECTIVES.some(item => attrs[item]);
    let hasIf = CONDITION_DIRECTIVES.some(item => attrs[item]);

    return hasForAttr && hasIf;
}

/* eslint-disable fecs-properties-quote */
module.exports = {
    import: {
        match: 'import',
        transform: transformExtNameElement
    },
    include: {
        match: 'include',
        transform: transformExtNameElement
    },
    template: {
        match: 'template',
        transform: transformTemplateElement
    },
    forIf: {
        match(element) {

            // for 和 condition 共存情况
            return bothForAndIFAttr(element.attribs);
        },
        transform: forIfTransform
    }
};
