/**
 * @file transform for and condition(if/else/else-if/elif)
 * @description  add block tag on the outside of the dom
 * eg:
 * <view for='xx' if='xx'>hello</view>  ->  <block for="xxx"><view if="xx">hello</view></block>
 * <view for='xx' else-if='xx'>hello</view>  ->  <block else-if='xxx'><view for="xxx">hello</view></block>
 * <view for='xx' elif='xx'>hello</view>  ->  <block elif='xxx'><view for="xxx">hello</view></block>
 * <view for='xx' else>hello</view>  ->  <block else><view for="xxx">hello</view></block>
 * @author sharonzd
 * @date 2018/9/2
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const {CONDITION_DIRECTIVES} = require('./constant');

/* eslint-disable fecs-properties-quote */

module.exports = function (node) {
    const childTagName = node.name;
    node.name = 'block';

    const childAttrs = Object.assign({}, node.attribs);

    // 对于for和if共存，for 优先级高于 if
    // 对于for和else-if/elif/else，for优先级低于else-if/elif/else
    CONDITION_DIRECTIVES.forEach(item => {
        if (node.attribs[item]) {
            let blockAttr = (item === 'if' ? 'for' : item);
            node.attribs = {[blockAttr]: childAttrs[blockAttr]};
            delete childAttrs[blockAttr];

            const forKeyValue = childAttrs[':key'];
            if (forKeyValue && item === 'if') {
                node.attribs[':key'] = forKeyValue;
                delete childAttrs[':key'];
            }
        }
    });

    // create new node according to the AST node structure
    let childNode = {
        type: 'tag',
        name: childTagName,
        attribs: childAttrs,
        children: node.children,
        prev: null,
        next: null,
        parent: node
    };

    node.children.forEach(item => {
        item.parent = childNode;
    });

    node.children = [childNode];
};
