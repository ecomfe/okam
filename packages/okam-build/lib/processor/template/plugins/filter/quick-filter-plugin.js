/**
 * @file Quick app template filter transform plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const {FILTER_NAME_WRAP_REGEXP} = require('../../transform/base/filter');

function findFilterModuleName(filters, filterName) {
    let found;
    filters.some(item => {
        if (item.filters.includes(filterName)) {
            found = item.name;
            return true;
        }

        return false;
    });

    return found;
}

function updateFilterCall(filters, logger, file, value) {
    if (typeof value !== 'string') {
        return value;
    }

    return value.replace(FILTER_NAME_WRAP_REGEXP, (match, filterName) => {
        let moduleName = findFilterModuleName(filters, filterName);
        if (!moduleName) {
            logger.error(
                'cannot find filter definition',
                filterName, 'in', file.path
            );
            return filterName;
        }
        return moduleName + '_' + filterName;
    });
}

/**
 * Transform element node filter info
 *
 * @param {Object} element the element node to transform
 * @param {Object} tplOpts the template transform options
 * @param {Object=} options the plugin options, optional
 */
function transformFilterInAttribute(element, tplOpts, options) {
    let attrs = element.attribs;
    let filterAttrs = element._hasFilterAttrs;
    if (!filterAttrs || !filterAttrs.length) {
        return;
    }

    let {logger, file} = tplOpts;
    let {filters} = options;
    filterAttrs.forEach(k => {
        let value = attrs[k];
        attrs[k] = updateFilterCall(filters, logger, file, value);
    });
}

function transformFilterInTextNode(node, tplOpts, options) {
    if (!node._hasFilter) {
        return;
    }

    let {logger, file} = tplOpts;
    let {filters} = options;
    node.data = updateFilterCall(filters, logger, file, node.data);
}

function initFilterModules(root, tplOpts, options) {
    let {filters} = options;
    filters.forEach((item, index) => {
        item.name = 'f';
    });
}

module.exports = {
    root: initFilterModules,
    tag: transformFilterInAttribute,
    text: transformFilterInTextNode
};

