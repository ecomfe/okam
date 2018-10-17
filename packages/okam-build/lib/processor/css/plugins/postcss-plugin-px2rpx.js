/**
 * @file postcss plugin px2rpx
 * @author xiaohong8023@outlook.com
 */

'use strict';

const postcss = require('postcss');
const Px2rpx = require('../../helper/px2rpx');

module.exports = postcss.plugin('postcss-plugin-px2rpx', function (opts = {}) {
    return function (css, result) {
        const px2rpxIns = new Px2rpx(opts);
        px2rpxIns.generateRpx(css);
    };
});
