/**
 * @file for if 并存处理
 * @author xiaohong8023@outlook.com
 *
 * wx:for wx:if 并存 => wx:for 高优
 * eg:
 * <view wx:for='xx' wx:if='xx'>hello</view>  ->  <block wx:for="xxx"><view wx:if="xx">hello</view></block>
 *
 * wx:for wx:elif wx:else 并存 => wx:for 高优
 * eg:
 * <view wx:for='xx' wx:else>hello</view>  ->  <block wx:else><view wx:for="xxx">hello</view></block>
 */

const {FOR_DIRECTIVES, CONDITION_DIRECTIVES} = require('./constant');

function curNodeTransformTwoNode(parentAttribs, curNode) {

    // copy curNode as new childNode
    let newChildNode = Object.assign(
        {
            prev: null,
            next: null
        },
        curNode
    );

    // curNode as parentNode
    let parentNode = Object.assign(
        curNode,
        {
            name: 'block',
            attribs: parentAttribs
        }
    );

    newChildNode.parent = parentNode;
    parentNode.children = [newChildNode];
}

module.exports = function (node) {
    let parentAttribs = {};
    let attrs = node.attribs;

    CONDITION_DIRECTIVES.some(conditionItem => {
        if (!attrs[conditionItem]) {
            return false;
        }

        // wx:if 时 for 高优
        if (conditionItem === CONDITION_DIRECTIVES[0]) {
            FOR_DIRECTIVES.forEach(forItem => {
                attrs[forItem] && (parentAttribs[forItem] = attrs[forItem]);
                delete attrs[forItem];
            });
        }

        // 其他时 for 低优
        else {
            parentAttribs[conditionItem] = attrs[conditionItem];
            delete attrs[conditionItem];
        }
        return true;
    });

    curNodeTransformTwoNode(parentAttribs, node);
};
