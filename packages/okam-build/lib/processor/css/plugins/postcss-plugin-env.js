/**
 * @file Postcss env plugin: remove not current app type style definition info.
 * e.g.,
 *
 * .title {
 *     font-size: 20px;
 *     -wx-font-size: 17px;
 *     -quick-font-size: 18px;
 * }
 *
 * @media not quick {
 *    .title {
 *         font-size: 15px;
 *    }
 * }
 *
 * @media quick {
 *    .title {
 *         font-size: 33px;
 *    }
 * }
 *
 * If the current build app target is `quick` app, then the above style rules
 * will be transformed and the output as the following:
 *
 * .title {
 *     font-size: 18px;
 * }
 *
 * .title {
 *     font-size: 33px;
 * }
 *
 * @author sparklewhy@gmail.com
 */

'use strict';

const postcss = require('postcss');
const matchAppMediaParams = require('./match-media-params');

/**
 * Process media rule.
 * Remove not current app media query target rule.
 * Remove current app media query params.
 *
 * @inner
 * @param {Array.<string>} allAppTypes all supported build media target
 * @param {string} appType the current build media target
 * @param {Object} rule the media query rule
 */
function processAppSpecifiedMediaRule(allAppTypes, appType, rule) {
    let result = matchAppMediaParams(allAppTypes, appType, rule.params);
    if (!result) {
        return;
    }

    let {removed, params} = result;
    params && (params = params.trim());
    if (removed) {
         // remove media rule, not current app media query target
        rule.remove();
    }
    else if (params) {
        // remove current app media query params
        rule.params = params;
    }
    else {
        // remove current app media query rule wrapping
        let children = rule.parent.nodes;
        let currRuleIdx = children.indexOf(rule);

        rule.nodes.forEach(item => {
            item.parent = rule.parent; // up parent

            let itemRaws = item.raws;
            let subNodes = item.nodes;

            // up raw style format
            subNodes && subNodes.forEach(
                sub => sub.raws.before = itemRaws.before
            );
            itemRaws.before = '\n';
            itemRaws.after = '\n';
        });

        children.splice(currRuleIdx, 1, ...rule.nodes);
        rule.nodes = null;
        rule.parent = null;
    }
}

/**
 * Remove the given property name style declaration that the position is
 * front of the current given style declaration.
 *
 * @inner
 * @param {Object} decl the style property declaration that will override
 *        the front of the style declaration that has the same property name
 * @param {string} toRemovePropName the property name to remove
 */
function removeUnUseDecl(decl, toRemovePropName) {
    let nodes = decl.parent.nodes;
    let currIdx = nodes.indexOf(decl);

    for (let i = currIdx - 1; i >= 0; i--) {
        let item = nodes[i];
        if (item.type === 'decl' && item.prop === toRemovePropName) {
            item.remove();
        }
    }
}

/**
 * The specified app related property declaration regexp
 *
 * @const
 * @type {RegExp}
 */
const SPECIFIED_APP_PROP_DECL_REGEXP = /^\-(\w+)\-/;

/**
 * Process specified app target css style property declaration
 *
 * @inner
 * @param {Array.<string>} allAppTypes all supported build media target
 * @param {string} appType the current build media target
 * @param {Object} decl css style declaration
 */
function processAppSpecifiedDeclaration(allAppTypes, appType, decl) {
    let {prop, parent} = decl;
    let result;
    if ((result = SPECIFIED_APP_PROP_DECL_REGEXP.exec(prop))) {
        let propApp = result[1];
        let isMatchApp = appType === propApp;
        if (allAppTypes.includes(propApp) && !isMatchApp) {
            // remove not current app build type style declaration
            decl.remove();
        }
        else if (isMatchApp) {
            // remove the previous property style declaration that has same
            // style property name declaration that ignore app type prefix
            // and remove the specified app type prefix of the property
            let newPropName = prop.replace(SPECIFIED_APP_PROP_DECL_REGEXP, '');
            removeUnUseDecl(decl, newPropName);
            decl.prop = newPropName;
        }

        // remove empty rule
        if (!parent.nodes || !parent.nodes.length) {
            parent.remove();
        }
    }
}

module.exports = postcss.plugin('postcss-plugin-env', function (opts = {}) {
    const {allAppTypes, appType} = opts;
    return function (css, result) {
        css.walkAtRules(rule => {
            if (rule.name === 'media') {
                processAppSpecifiedMediaRule(allAppTypes, appType, rule);
            }
        });

        css.walkDecls(
            decl => processAppSpecifiedDeclaration(allAppTypes, appType, decl)
        );
    };
});
