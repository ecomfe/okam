/**
 * @file Convert Vue filter syntax to mini program syntax
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

'use strict';

const FILTER_CALL_REGEXP = /\((.*)\)$/;
const BIND_VAR_REGEXP = /{{(.*?)}}/g;
const FILTER_SYNTAX_REGEXP = /^([^\|]+\s*\|\s*)+[^\|]+$/;

const FILTER_FUNC_WRAPPER_START = '#FILTER:{';
const FILTER_FUNC_WRAPPER_END = '}!#';

function wrapFilterName(name) {
    return FILTER_FUNC_WRAPPER_START + name + FILTER_FUNC_WRAPPER_END;
}

function transformPipeFilter(value, filterOption, logger) {
    if (value.indexOf('|') === -1 || !FILTER_SYNTAX_REGEXP.test(value)) {
        return value;
    }

    let {onFilter} = filterOption || {};
    let parts = value.split('|');
    let callExpression = parts[0].trim();
    if (!callExpression) {
        logger.debug('ignore filter value', parts[0], 'in', value);
        return value;
    }

    for (let i = 1, len = parts.length; i < len; i++) {
        let filter = parts[i].trim();

        let result = FILTER_CALL_REGEXP.exec(filter);
        let args;
        if (result) {
            filter = filter.substring(0, filter.indexOf('(')).trim();
            args = result[1].trim();
            args = callExpression + (args ? ',' : '') + args;
        }
        else {
            args = callExpression;
        }

        // trigger filter callback
        onFilter && onFilter(filter);

        filter = wrapFilterName(filter);
        callExpression = filter + `(${args})`;
    }

    return callExpression;
}

exports.FILTER_SYNTAX_REGEXP = FILTER_SYNTAX_REGEXP;

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
            value = value.trim();
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
