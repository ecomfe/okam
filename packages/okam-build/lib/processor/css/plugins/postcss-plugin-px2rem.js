/**
 * @file Postcss plugin px2rem
 * @author sparklewhy@gmail.com
 */

'use strict';

const postcss = require('postcss');

const {transformPx, isNPMFilePath} = require('./px-helper');

function px2rem(cssAst, opts) {
    let {precision, rootFontSize} = opts;
    precision = parseInt(typeof precision === 'undefined' ? 2 : 0, 10) || 0;
    rootFontSize = parseInt(rootFontSize, 10) || 16;
    const {noTrans1px, keepComment, transform} = opts;

    return transformPx(cssAst, {
        noTrans1px,
        keepComment: keepComment || 'px2rem: no',
        transform: transform || (value => {
            let num = parseFloat(value, 10) / rootFontSize;
            num = Number.isInteger(num) ? num : num.toFixed(precision);
            return `${num}rem`;
        })
    });
}

module.exports = postcss.plugin('postcss-plugin-px2rem', function (opts = {}) {
    let {filePath, ignore} = opts;
    ignore || (ignore = isNPMFilePath);

    return function (css, result) {
        if (ignore(filePath)) {
            return;
        }

        px2rem(css, opts);
    };
});
