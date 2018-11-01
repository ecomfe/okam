/**
 * @file postcss wxss to swan css plugin
 * @author xiaohong8023@outlook.com
 */

'use strict';

const postcss = require('postcss');

module.exports = postcss.plugin('postcss-plugin-wx2swan', function (opts = {}) {
    return function (css, result) {
        css.walkAtRules(rule => {
            if (rule.name === 'import') {
                const depRelPath = rule.params.slice(1, -1);
                rule.params = rule.params.replace(/\.wxss/, '.css');
                result.deps || (result.deps = []);
                result.deps.push(depRelPath);
            }
        });
    };
});
