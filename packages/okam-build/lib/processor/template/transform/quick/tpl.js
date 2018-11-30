/**
 * @file Transform quick app import tpl syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const {file: fileUtil} = require('../../../../util/index');
const {parse: parseDom} = require('../../parser');
const {PLAIN_OBJECT_REGEXP} = require('../base/constant');
const {removeEmptyTextNode} = require('../base/helper');
const DATA_ATTR = ':data';

/**
 * Get the imported template element based on the given template name.
 *
 * @inner
 * @param {Object} tplFile the imported template file
 * @param {string} name the template name to use
 * @return {?Object}
 */
function getImportTemplateElement(tplFile, name) {
    if (!name) {
        return;
    }

    let ast = tplFile.ast;
    if (!ast) {
        ast = tplFile.ast = parseDom(tplFile.content.toString());
    }

    let children = ast.children;
    for (let i = 0, len = children.length; i < len; i++) {
        let node = children[i];
        if (node.type === 'tag' && node.name === 'template') {
            let {attribs: attrs} = node;
            if (attrs && attrs.name === name) {
                return node;
            }
        }
    }
}

/**
 * Find the import element
 * Notice: currently, it does not support multiple import elements in template.
 *
 * @inner
 * @param {Object} node the element node to use the import template
 * @return {?Object}
 */
function findImportElement(node) {
    let parent = node.parent;
    if (!parent) {
        return;
    }

    let children = parent.children;
    let found;
    children.some(item => {
        if (item.type === 'tag' && item.name === 'import') {
            found = item;
            return true;
        }
        return false;
    });

    if (found) {
        return found;
    }

    return findImportElement(parent);
}

/**
 * Parse the used data information of the import template. If the data attribute
 * name is not changed, it'll ignore.
 *
 * e.g.,
 * input: a:b, c, ...obj
 * output: {a: b}
 *
 * @inner
 * @param {string} value the data value
 * @return {?Object}
 */
function parseTplDataInfo(value) {
    value = value.substring(1, value.length - 1);
    let items = value.split(',');
    let dataObjAttrs = {};
    items.forEach(item => {
        let colonIdx = item.indexOf(':');
        if (colonIdx !== -1) {
            let key = item.substring(0, colonIdx).trim();
            let value = item.substr(colonIdx + 1).trim();

            key === value || (dataObjAttrs[key] = value);
        }
    });

    return Object.keys(dataObjAttrs).length ? dataObjAttrs : null;
}

/**
 * Replace template variable using the new data variable name
 *
 * @inner
 * @param {string} value the value to update
 * @param {Object} data the data variable name map, key is the old variable name,
 *        value is the new variable name
 * @return {string} return the updated value
 */
function replaceTemplateVariable(value, data) {
    return value.replace(/\{\{(.+)\}\}/g, (match, varName) => {
        varName = varName.trim();
        let newVarName = data[varName];
        if (newVarName) {
            return `{{${newVarName}}}`;
        }
        return match;
    });
}

/**
 * Replace element attribute bind data variable using the new data variable name
 *
 * @inner
 * @param {Object} attrs the attributes to update
 * @param {Object} data the data variable name map, key is the old variable name,
 *        value is the new variable name
 * @return {Array} return the updated attributes
 */
function replaceElementAttributeVariable(attrs, data) {
    let newAttrs = Object.assign({}, attrs);

    attrs && Object.keys(attrs).forEach(k => {
        let value = attrs[k];
        if (k.startsWith(':')) {
            // replace okam data variable
            let newDataName = data[value];
            newDataName && (newAttrs[k] = newDataName);
        }
        else {
            value = replaceTemplateVariable(value, data);
            newAttrs[k] = value;
        }
    });
    return newAttrs;
}

/**
 * Update the inline template data variable name
 *
 * @inner
 * @param {Object} element the element to update
 * @param {Object} data the data variable name map, key is the old variable name,
 *        value is the new variable name
 * @return {Array} return the updated element nodes
 */
function updateTemplateDataVariableName(element, data) {
    let {children} = element;
    let result = [];
    children && children.forEach(item => {
        let {type} = item.type;
        let newItem = Object.assign({}, item);

        if (type === 'tag') {
            let {attribs: attrs, children} = item;
            newItem.attribs = replaceElementAttributeVariable(attrs, data);

            if (children) {
                let newChildren = updateTemplateDataVariableName(item, data);
                newChildren && (newItem.children = newChildren);
            }
        }
        else if (type === 'text') {
            let {data: textValue} = item;
            textValue = replaceTemplateVariable(textValue, data);
            newItem.data = textValue;
        }

        result.push(newItem);
    });
    return result;
}

/**
 * Inline import template element, and update the inline template data variable
 * e.g.,
 * <view>
 *    <import src="a.tpl" />
 *    <tpl is="xx" data={{a: b}} />
 *    <view>others</view>
 * </view>
 *
 * a.tpl template:
 * <view>{{a}}</view>
 *
 * output:
 * <view>
 *     <view>{{b}}</view>
 *     <view>others</view>
 * </view>
 *
 * @param {Object} element the tpl element that uses the imported template
 * @param {Object} tplOpts the template transformation options
 * @param {Object=} opts the plugin options
 */
module.exports = function (element, tplOpts, opts) {
    let {logger, file, getFileByFullPath} = tplOpts;
    let importTplElement = findImportElement(element);
    if (!importTplElement) {
        logger.error(
            file.path,
            'cannot find the import template element'
        );
        return;
    }

    // Get the import template file
    let {attribs: attrs} = importTplElement;
    let tplPath = attrs && attrs.src;
    if (!tplPath) {
        logger.error(file.path, 'import element missing `src` information');
        return;
    }

    let refTplFile = getFileByFullPath(
        fileUtil.getFullPath(tplPath, file.fullPath)
    );
    if (!refTplFile) {
        logger.error(file.path, 'imported template is not found', tplPath);
        return;
    }

    // do not release the reference template file
    refTplFile.release = false;

    // inline the template
    let refTplName = element.attribs && element.attribs.is;
    let inlineTplElement = getImportTemplateElement(refTplFile, refTplName);
    if (!inlineTplElement) {
        logger.error(file.path, 'imported template name is not found:', refTplName);
        return;
    }

    // update template data variable name
    let toAddElements = inlineTplElement.children;
    if (attrs.hasOwnProperty(DATA_ATTR)) {
        let dataValue = attrs[DATA_ATTR];
        if (typeof dataValue === 'string') {
            dataValue = dataValue.trim();
            if (PLAIN_OBJECT_REGEXP.test(dataValue)) {
                let dataNames = parseTplDataInfo(dataValue);
                toAddElements = dataNames && updateTemplateDataVariableName(
                    inlineTplElement, dataNames
                );
            }
        }
    }

    // add remove flag, remove <import src="xxx" /> element
    importTplElement.removed = true;
    removeEmptyTextNode(importTplElement.prev);

    // add remove flag, remove <tpl is="xx" data="xx" /> element
    element.removed = true;
    removeEmptyTextNode(element.prev, element.next);

    // insert inline template elements
    let children = element.parent.children;
    let findInsertIdx = children.indexOf(element);
    children.splice(findInsertIdx + 1, 0, ...toAddElements);

    // notify visitor node structure change
    this.nodeChange();
};
