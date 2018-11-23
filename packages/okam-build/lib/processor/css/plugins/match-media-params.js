/**
 * @file Media query target params matcher
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * Convert media query to js expression
 *
 * @inner
 * @param {Array.<string>} tokens the env media query param tokens
 * @param {Array.<string>} allAppTypes all supported media target types
 * @param {string} appType current build media target app type
 * @return {string}
 */
function convertMediaQueryToJSExpression(tokens, allAppTypes, appType) {
    let result = [];
    tokens.forEach(item => {
        item = item.trim();
        if (allAppTypes.includes(item)) {
            result.push(`('${item}' === '${appType}')`);
        }
        else if (item === 'and') {
            result.push('&&');
        }
        else if (item === ',' || item === 'or') {
            result.push('||');
        }
        else if (item === 'not') {
            result.push('!');
        }
        else if (item === '(' || item === ')') {
            result.push(item);
        }
    });


    let lastItem = result[result.length - 1];
    if (lastItem === '&&' || lastItem === '||') {
        result.pop();
    }

    // remove no use leading brace if has
    let braceStack = [];
    result.forEach((item, index) => {
        if (item === '(') {
            braceStack.push(index);
        }
        else if (item === ')') {
            braceStack.pop();
        }
    });
    for (let i = braceStack.length - 1; i >= 0; i--) {
        result.splice(braceStack[i], 1);
    }

    return result.join('');
}

/**
 * Determine the given media app query params is match with the current
 * build media target.
 *
 * @inner
 * @param {string} params the full media query params
 * @param {Array.<string>} tokens the env media query param tokens
 * @param {Array.<string>} allAppTypes all supported build media target
 * @param {string} appType the current build media target
 * @return {{value: boolean, expression: string}}
 */
function isAppMediaMatch(params, tokens, allAppTypes, appType) {
    let expression = convertMediaQueryToJSExpression(tokens, allAppTypes, appType);
    try {
        return {
            /* eslint-disable fecs-no-eval */
            value: eval(expression),
            expression
        };
    }
    catch (ex) {
        throw new Error('illegal style env media rule:' + params);
    }
}

const QUERY_PARAMS_SEPARATORS = ['(', ')', ',', ' '];
const MEDIA_QUERY_OPERATORS = ['not', 'and', 'or', 'only'];

/**
 * Normalize the app media query tokens in place.
 *
 * @inner
 * @param {Array.<string>} tokens the tokens to normalize
 */
function normalizeAppMediaQueryTokens(tokens) {
    for (let i = tokens.length - 1; i >= 0; i--) {
        let item = tokens[i].trim();
        if (item && item !== '(') {
            break;
        }

        tokens.pop();
    }
}

/**
 * Initialize the app media query target information.
 * Return whether should stop media query params token parsing.
 *
 * @inner
 * @param {Object} ctx the token parser context
 * @param {string} currToken the current encountered token
 * @return {boolean}
 */
function initAppMediaTargetInfo(ctx, currToken) {
    let {allAppTypes, hasAppMediaType} = ctx;
    let isAppMediaTarget = allAppTypes.includes(currToken);
    hasAppMediaType || (ctx.hasAppMediaType = isAppMediaTarget);

    if (!isAppMediaTarget && !MEDIA_QUERY_OPERATORS.includes(currToken)) {
        return true;
    }

    return false;
}

/**
 * Initialize the app media query tokens.
 * Return the new cache token string or true, if return true, meaning that
 * it should stop parse tokens.
 *
 * @param {Object} ctx the parse context
 * @param {string} buffer the current collect token string
 * @param {string} separator the current separator that is encountered
 * @return {boolean|string}
 */
function initAppMediaQueryToken(ctx, buffer, separator) {
    let currToken = buffer.trim();
    let {tokens} = ctx;
    if (currToken) {
        if (initAppMediaTargetInfo(ctx, currToken)) {
            return true;
        }

        tokens.push(buffer);
        tokens.push(separator);

        return '';
    }

    buffer += separator;
    if (buffer.trim()) {
        tokens.push(buffer);
        return '';
    }
    return buffer;
}

/**
 * Parse app media query params info
 *
 * @inner
 * @param {Array.<string>} allAppTypes all supported media target types
 * @param {string} params the full media query params
 * @return {{hasAppMediaType: boolean, tokens: Array.<string>}}
 */
function parseAppMediaQueryParam(allAppTypes, params) {
    let ctx = {
        allAppTypes,
        hasAppMediaType: false,
        tokens: []
    };

    let buffer = '';
    for (let i = 0, len = params.length; i < len; i++) {
        let c = params[i];
        if (QUERY_PARAMS_SEPARATORS.includes(c)) {
            buffer = initAppMediaQueryToken(ctx, buffer, c);
            if (buffer === true) {
                buffer = '';
                break;
            }
        }
        else {
            buffer += c;
        }
    }

    if (buffer) {
        let result = initAppMediaTargetInfo(ctx, buffer.trim());
        result || (ctx.tokens.push(buffer));
    }

    return ctx;
}

/**
 * Match the app media target query params.
 * Return whether the media query rule should been removed or
 * the rewritten media query params.
 *
 * @param {Array.<string>} allAppTypes all supported media target types
 * @param {string} appType current build media target app type
 * @param {string} params the full media query params
 * @return {?{removed: boolean, params: string}}
 */
module.exports = function matchAppMediaParams(allAppTypes, appType, params) {
    if (!params || !params.trim()) {
        return;
    }

    let {hasAppMediaType, tokens} = parseAppMediaQueryParam(
        allAppTypes, params
    );
    if (!hasAppMediaType) {
        return;
    }

    if (tokens.length) {
        normalizeAppMediaQueryTokens(tokens);
    }

    let {value: isMatch, expression} = isAppMediaMatch(
        params, tokens, allAppTypes, appType
    );
    if (isMatch) {
        return {
            expression,
            params: params.substr(tokens.join('').length),
            removed: false
        };
    }

    return {
        expression,
        removed: true
    };
};
