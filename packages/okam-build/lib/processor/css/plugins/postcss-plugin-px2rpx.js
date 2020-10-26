/**
 * @file postcss plugin px2rpx
 * @author xiaohong8023@outlook.com
 */

'use strict';

const postcss = require('postcss');
const {transformPx, isNPMFilePath} = require('./px-helper');

function px2rpx(cssAst, opts) {
    let {precision} = opts;
    precision = parseInt(typeof precision === 'undefined' ? 2 : 0, 10) || 0;

    const proportion = 750 / (opts.designWidth || 750);
    const {noTrans1px, keepComment, transform} = opts;

    return transformPx(cssAst, {
        noTrans1px,
        keepComment: keepComment || 'px2rpx: no',
        transform: transform || (value => {
            let num = proportion * parseFloat(value, 10);
            num = Number.isInteger(num) ? num : num.toFixed(precision);
            return `${num}rpx`;
        })
    });
}

module.exports = postcss.plugin('postcss-plugin-px2rpx', function (opts = {}) {
    let {filePath, ignore} = opts;
    ignore || (ignore = isNPMFilePath);

    return function (css, result) {
        if (ignore(filePath)) {
            return;
        }

        px2rpx(css, opts);
    };
});
