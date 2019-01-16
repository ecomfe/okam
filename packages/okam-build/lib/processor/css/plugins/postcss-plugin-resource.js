/**
 * @file Postcss dependence resource process plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const postcss = require('postcss');
const {resolveUrlPath} = require('../../helper/url');

const URL_REGEXP = /(url\s*\(\s*['"]?\s*)([^'"\)]+)(\s*['"]?\s*\))/g;

function processStyleDeclaration(decl, opts) {
    let {value} = decl;
    if (!URL_REGEXP.test(value)) {
        return;
    }

    let {file, resolve, logger} = opts;
    decl.value = value.replace(URL_REGEXP, (match, prefix, url, suffix) => {
        let relPath = resolveUrlPath(url, file, resolve, logger);
        if (!relPath) {
            return match;
        }

        return prefix + relPath + suffix;
    });
}

module.exports = postcss.plugin('postcss-plugin-resource', function (opts = {}) {
    let {styleExtname: extname, file, resolve} = opts;
    return function (css) {
        if (file.analysedDeps) {
            return;
        }
        file.analysedDeps = true;

        css.walkDecls(decl => processStyleDeclaration(decl, opts));
        css.walkAtRules(rule => {
            if (rule.name === 'import') {
                let relPath = rule.params.slice(1, -1);
                relPath = resolve(file, relPath);
                extname && (relPath = relPath.replace(/\.css$/, '.' + extname));
                rule.params = `'${relPath}'`;
            }
        });
    };
});
