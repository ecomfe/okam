/**
 * @file wxs2filter.js
 * @author xiaohong8023@outlook.com
 *
 * // swan 不支持
 * module.exports.message = msg;
 * module.exports = fn;
 *
 * 当前仅处理了
 * module.exports = {}
 *
 * @see https://smartprogram.baidu.com/docs/develop/framework/view_filter/
 * @see https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxs/
 */

function wxs2filter(content) {
    return content.replace(/module\.exports\s*=/, 'export default');
}

module.exports = exports = wxs2filter;
