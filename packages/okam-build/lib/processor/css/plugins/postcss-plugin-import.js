/**
 * @file Postcss import plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const postcss = require('postcss');

module.exports = postcss.plugin('postcss-plugin-import', function (opts = {}) {
    return function (css, result) {
        css.walkAtRules(rule => {
            if (rule.name === 'import') {
                const depRelPath = rule.params.slice(1, -1);
                result.deps || (result.deps = []);
                result.deps.push(depRelPath);
            }
        });
    };
});
