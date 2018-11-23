/**
 * @file Postcss env plugin: remove not current app type style definition info.
 * e.g.,
 * @media swan, wx {
 *    .title {
 *         font-size: 15px;
 *    }
 * }
 *
 * @media not quick {
 *    .title {
 *         font-size: 15px;
 *    }
 * }
 * @author sparklewhy@gmail.com
 */

'use strict';

const postcss = require('postcss');
const matchAppMediaParams = require('./match-media-params');

function processMediaRule(allAppTypes, appType, rule) {
    let result = matchAppMediaParams(allAppTypes, appType, rule.params);
    if (!result) {
        return;
    }

    // remove media rule
    let {removed, params} = result;
    params && (params = params.trim());
    if (removed) {
        rule.remove();
    }
    else if (params) {
        rule.params = params;
    }
    else {
        let children = rule.parent.nodes;
        let currRuleIdx = children.indexOf(rule);
        rule.nodes.forEach((item, index) => {
            item.parent = rule.parent;
            let itemRaws = item.raws;
            let subNodes = item.nodes;
            subNodes && subNodes.forEach(
                sub => sub.raws.before = itemRaws.before
            );
            itemRaws.before = index ? '\n' : '';
            itemRaws.after = '\n';
        });
        children.splice(currRuleIdx, 1, ...rule.nodes);
        rule.nodes = null;
        rule.parent = null;
    }
}

module.exports = postcss.plugin('postcss-plugin-env', function (opts = {}) {
    const {allAppTypes, appType} = opts;
    return function (css, result) {
        css.walkAtRules(rule => {
            if (rule.name === 'media') {
                processMediaRule(allAppTypes, appType, rule);
            }
        });
    };
});
