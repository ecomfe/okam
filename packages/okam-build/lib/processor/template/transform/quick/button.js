/**
 * @file Wrapping okam button component text content using `span` element or
 *       replacing `text` element with `span`.
 * @author sparklewhy@gmail.com
 */

'use strict';

function wrapTextData(parentNode, nodeIdx, textNode) {
    let {children} = parentNode;
    let newParentNode = {
        type: 'tag',
        name: 'span',
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

function processButtonTextData(element) {
    let {children} = element;
    let textNodes = [];
    children.forEach((node, index) => {
        let {type, data} = node;

        if (type === 'tag' && node.name === 'text') {
            // replace node tag, as for text tag is not supported in okam-button
            node.name = 'span';
        }
        else if (type === 'text' && data.trim().length) {
            textNodes.push({index, node});
        }
    });

    if (!textNodes.length) {
        return;
    }

    textNodes.forEach(({index, node}) => wrapTextData(element, index, node));
}

module.exports = processButtonTextData;
