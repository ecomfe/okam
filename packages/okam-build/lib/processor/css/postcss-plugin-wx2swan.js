/**
 * @file postcss plugin px2rpx
 * @author xiaohong8023@outlook.com
 */

'use strict';

const postcss = require('postcss');
const path = require('path');

module.exports = postcss.plugin('postcss-plugin-wx2swan', function (opts = {}) {

    let file = opts.file;

    return function (css, result) {
        css.walkAtRules(rule => {
            if (rule.name === 'import') {
                // path.resolve(file.fullPath, );
                const depRelPath = rule.params.slice(1, -1);
                rule.params = rule.params.replace(/\.wxss/, '.css');
                file.addDeps(depRelPath);
            }
        });
    };
});
