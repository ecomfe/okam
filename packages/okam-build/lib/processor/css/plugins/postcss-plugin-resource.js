/**
 * @file Postcss dependence resource process plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const postcss = require('postcss');
const {parse: parseUrl} = require('url');

const URL_REGEXP = /(url\s*\(\s*['"]?\s*)([^'"\)]+)(\s*['"]?\s*\))/g;
const HTTP_PROTOCOL_REGEXP = /^https?\:\/\//;

function processStyleDeclaration(decl, opts) {
    let {value} = decl;
    if (!URL_REGEXP.test(value)) {
        return;
    }

    let {file, resolve} = opts;
    decl.value = value.replace(URL_REGEXP, (match, prefix, url, suffix) => {
        // ignore http url and data base64 resource
        if (HTTP_PROTOCOL_REGEXP.test(url) || url.startsWith('data:')) {
            return match;
        }

        let urlInfo = parseUrl(url);
        let {pathname, search, hash} = urlInfo;
        if (pathname.charAt(0) !== '.') {
            pathname = './' + pathname;
        }

        let resolvePath = resolve(file, pathname);
        if (!resolvePath) {
            return match;
        }

        let relPath = resolvePath + (search || '') + (hash || '');
        return prefix + relPath + suffix;
    });
}

module.exports = postcss.plugin('postcss-plugin-resource', function (opts = {}) {
    let {styleExtname: extname, file, resolve} = opts;
    return function (css) {
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
