/**
 * @file wxs 处理
 * @author xiaohong8023@outlook.com
 *
 */

const path = require('path');
const {moduleExportHandle} = require('../../../helper/wxs2filter');

module.exports = function transformWxsElement(element, tplOpts, opts) {

    let {attribs, children} = element;
    let {file, addFile} = tplOpts;

    element.name = 'filter';
    let src = attribs.src;

    if (src) {
        file.addDeps(src);
        let wxsPath = path.join(file.dirname, src);
        let wxsDepFile = addFile(wxsPath);
        wxsDepFile.isWxsScript = true;
        attribs.src = src.replace(/\.wxs/, '.filter.js');
    }

    if (!children.length) {
        return;
    }

    children.forEach(item => {
        let content = item.data;
        content && (item.data = moduleExportHandle(content));
    });
};
