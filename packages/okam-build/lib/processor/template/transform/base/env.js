/**
 * @file Transform *-env wrapping tpl syntax
 * e.g., the template is like the following:
 * <view>hello</view>
 * <wx-env>
 *   <view>Hello weixin</view>
 * </wx-env>
 *
 * If build target is not weixin app, the transformation output is like the following
 * <view>hello</view>
 *
 * If build target is weixin app, the transformation output:
 * <view>hello</view>
 * <view>Hello weixin</view>
 *
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const {ENV_ELEMENT_REGEXP} = require('./constant');
const {removeEmptyTextNode} = require('./helper');

module.exports = function transformEnvElement(element, tplOpts, opts) {
    let {appType} = tplOpts;
    let {name, parent} = element;

    let envTarget = name.replace(ENV_ELEMENT_REGEXP, '');
    let {children: parentChildren} = parent;
    let {children: elementChildren} = element;
    let currElemIdx = parentChildren.indexOf(element);
    let {prev, next} = element;
    if (envTarget !== appType) {
        parentChildren.splice(currElemIdx, 1);
        removeEmptyTextNode(prev);
    }
    else if (elementChildren) {
        elementChildren.forEach(item => item.parent = parent);

        let len = elementChildren.length;
        if (len) {
            elementChildren[0].prev = element;
            elementChildren[len - 1].next = element.next;
            element.next = elementChildren[0];
        }

        parentChildren.splice(currElemIdx + 1, 0, ...elementChildren);
        element.children = [];

        removeEmptyTextNode(elementChildren[0], next);
    }

    element.removed = true;
    // let {prev, next} = element;
    // removeEmptyTextNode(prev, next);
    this.nodeChange();
};
