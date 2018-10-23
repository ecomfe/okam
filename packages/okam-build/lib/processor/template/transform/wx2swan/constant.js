/**
 * @file transform regexp constants
 * @author xiaohong8023@outlook.com
 */


'use strict';

exports.WX_DIRECTIVES_REGEXP = /^wx:/;
exports.DOUBLE_BRACES_REGEXP = /^{{.*}}$/;
// 'wx:if' 放第一个元素 作为 for if 并存处理时的判断
exports.CONDITION_DIRECTIVES = ['wx:if', 'wx:elif', 'wx:else'];
exports.FOR_DIRECTIVES = ['wx:for', 'wx:for-items', 'wx:for-item', 'wx:for-index', 'wx:key'];
