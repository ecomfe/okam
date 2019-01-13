/**
 * @file postcss wxss to swan css plugin
 * @author xiaohong8023@outlook.com
 */

'use strict';

const postcss = require('postcss');

module.exports = postcss.plugin('postcss-plugin-wx2swan', function (opts = {}) {
    return function (css) {
        css.walkAtRules(rule => {
            if (rule.name === 'import') {
                rule.params = rule.params.replace(/\.wxss/, '.css');
            }
        });
    };
});
