/**
 * @file postcss plugin px2rpx
 * @author xiaohong8023@outlook.com
 */

'use strict';

const postcss = require('postcss');
const Px2rpx = require('../../helper/px2rpx');

function shouldIgnore(path) {
    if (path.indexOf('node_modules') !== -1) {
        return true;
    }
    return false;
}

module.exports = postcss.plugin('postcss-plugin-px2rpx', function (opts = {}) {
    let {filePath, ignore} = opts;
    ignore || (ignore = shouldIgnore);

    return function (css, result) {
        if (ignore(filePath)) {
            return;
        }

        const px2rpxIns = new Px2rpx(opts);
        px2rpxIns.generateRpx(css);
    };
});
