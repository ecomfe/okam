/**
 * @file Wrapping the text content using text element, as for in quick app only
 *      `text`, `a`, `span`, `label` component can place the text content.
 *       e.g., <view>Hello</view> output: <view><text>Hello</text></view>
 * @author sparklewhy@gmail.com
 */

'use strict';

const TEXT_CONTAINER = ['a', 'text', 'span', 'label'];

function wrapTextData(parentNode, nodeIdx, textNode) {
    let {children} = parentNode;
    let newParentNode = {
        type: 'tag',
        name: 'text',
        children: [textNode],
        prev: nodeIdx > 0 ? parentNode[nodeIdx - 1] : null,
        next: null,
        parent: parentNode
    };
    textNode.parent = newParentNode;

    if (nodeIdx > 0) {
        // up next pointer
        children[nodeIdx - 1].next = newParentNode;
    }

    children.splice(nodeIdx, 1, newParentNode);
}

function processElementTextData(element) {
    let {name, children} = element;
    if (TEXT_CONTAINER.includes(name)) {
        return;
    }

    let textNodes = [];
    children.forEach((node, index) => {
        let {type, data} = node;
        if (type === 'text' && data.trim().length) {
            textNodes.push({index, node});
        }
    });

    if (!textNodes.length) {
        return;
    }

    textNodes.forEach(({index, node}) => wrapTextData(element, index, node));
}

module.exports = processElementTextData;
