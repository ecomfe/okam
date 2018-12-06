/**
 * @file Postcss import plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const postcss = require('postcss');

module.exports = postcss.plugin('postcss-plugin-import', function (opts = {}) {
    return function (css, result) {

        let extname = opts.styleExtname;

        css.walkAtRules(rule => {
            if (rule.name === 'import') {
                const depRelPath = rule.params.slice(1, -1);

                extname && (rule.params = rule.params.replace(/\.css/, '.' + extname));

                result.deps || (result.deps = []);
                result.deps.push(depRelPath);
            }
        });
    };
});
