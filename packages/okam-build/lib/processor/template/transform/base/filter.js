/**
 * @file Convert Vue filter syntax to mini program syntax
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

'use strict';

const FILTER_CALL_REGEXP = /\((.*)\)$/;
const FILTER_NAME_REGEXP = /^[\w\$]+$/;
const BIND_VAR_REGEXP = /{{(.*?)}}/g;

const FILTER_FUNC_WRAPPER_START = '#FILTER:{';
const FILTER_FUNC_WRAPPER_END = '}!#';

function wrapFilterName(name) {
    return FILTER_FUNC_WRAPPER_START + name + FILTER_FUNC_WRAPPER_END;
}

function transformPipeFilter(value, filterOption, logger) {
    if (value.indexOf('|') === -1 || /['"\]}]$/.test(value)) {
        return value;
    }

    let {onFilter} = filterOption || {};
    let parts = value.split('|');
    let callExpression = parts[0].trim();
    if (!callExpression) {
        logger.error('invalidated filter value', parts[0], 'in', value);
        return value;
    }

    for (let i = 1, len = parts.length; i < len; i++) {
        let filter = parts[i].trim();

        // trigger filter callback
        onFilter && onFilter(filter);

        if (!FILTER_NAME_REGEXP.test(filter)) {
            logger.error('invalidated filter', filter, 'in', value);
            return value;
        }

        filter = wrapFilterName(filter);
        let result = FILTER_CALL_REGEXP.exec(filter);
        let args;
        if (result) {
            args = result[1].trim();
            args = callExpression + (args ? ',' : '') + args;
        }
        else {
            args = callExpression;
        }

        callExpression = filter + `(${args})`;
    }

    return callExpression;
}

exports.FILTER_NAME_WRAP_REGEXP = new RegExp(
    FILTER_FUNC_WRAPPER_START
    + '(.*?)'
    + FILTER_FUNC_WRAPPER_END,
    'g'
);

exports.transformPipeFilter = transformPipeFilter;

exports.transformTextNode = function (textNode, filterOptions, logger) {
    let data = textNode.data;
    if (!data || data.indexOf('{{') === -1) {
        return;
    }

    let hasFilter = false;
    textNode.data = data.replace(
        BIND_VAR_REGEXP,
        (match, value) => {
            let result = transformPipeFilter(
                value, filterOptions, logger
            );

            if (result !== value) {
                hasFilter = true;
            }

            return `{{${result}}}`;
        }
    );

    if (hasFilter) {
        textNode._hasFilter = hasFilter;
    }
};
