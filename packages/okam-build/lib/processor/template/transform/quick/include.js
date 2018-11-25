/**
 * @file Transform quick app include tpl syntax:
 *       <include src="../../common/tpl/include.tpl"/>
 * @author sparklewhy@gmail.com
 */

'use strict';

const {file: fileUtil} = require('../../../../util/index');
const {parse: parseDom} = require('../../parser');
const {removeEmptyTextNode} = require('../base/helper');

/**
 * Get included template element
 *
 * @inner
 * @param {Object} tplFile the included template file
 * @return {?Object}
 */
function getIncludeTemplateElement(tplFile) {
    let ast = tplFile.ast;
    if (!ast) {
        ast = tplFile.ast = parseDom(tplFile.content.toString());
    }

    let children = ast.children;
    for (let i = 0, len = children.length; i < len; i++) {
        let node = children[i];
        if (node.type === 'tag' && node.name === 'template') {
            return node;
        }
    }
}

/**
 * Inline include template element
 *
 * @param {Object} element the include element
 * @param {Object} tplOpts the template transformation options
 * @param {Object=} opts the plugin options
 */
module.exports = function (element, tplOpts, opts) {
    let {logger, file, getFileByFullPath} = tplOpts;
    let {attribs: attrs} = element;
    let tplPath = attrs && attrs.src;
    if (!tplPath) {
        logger.error('include element missing `src` information');
        return;
    }

    let includedTplFile = getFileByFullPath(
        fileUtil.getFullPath(tplPath, file.fullPath)
    );
    if (!includedTplFile) {
        logger.error('included template is not found', tplPath);
        return;
    }

    // do not release the included template file
    includedTplFile.release = false;

    // inline the included template
    let inlineTplElement = getIncludeTemplateElement(includedTplFile);

    // add remove flag, remove <include src="xx" /> element
    element.remove = true;
    removeEmptyTextNode(element.prev);

    if (!inlineTplElement
        || !inlineTplElement.children
        || !inlineTplElement.children.length
    ) {
        return;
    }

    // insert inline template elements
    let children = element.parent.children;
    let findInsertIdx = children.indexOf(element);
    children.splice(findInsertIdx + 1, 0, ...inlineTplElement.children);

    // notify visitor node structure change
    this.nodeChange();
};
