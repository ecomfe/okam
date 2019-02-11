/**
 * @file Template style binding syntax helper
 * @author sparklewhy@gmail.com
 */

'use strict';

function isValidatedStylePropSeperator(value, startIdx, commaIdx) {
    let leftBraceNum = 0;
    let rightBraceNum = 0;

    let idx = commaIdx + 1;
    while (idx > startIdx) {
        let token = value.charAt(idx);
        if (token === '(') {
            leftBraceNum++;
        }
        else if (token === ')') {
            rightBraceNum++;
        }
        idx--;
    }

    return leftBraceNum === rightBraceNum;
}

function parseStyleProp(style) {
    let colonIdx = style.indexOf(':');
    let styleProp;
    let styleValue;
    if (colonIdx === -1) {
        styleProp = style.trim();
        styleValue = styleProp;
    }
    else {
        styleProp = style.substring(0, colonIdx).trim();
        styleValue = style.substr(colonIdx + 1).trim();
    }

    if (!styleProp) {
        return;
    }

    styleValue = styleValue.replace(/`(.+)`/g, (match, str) => {
        return '\'' + str.replace(/\${(.+?)}/g, (subMatch, express) => {
            return '\' + ' + express + ' + \'';
        }) + '\'';
    });
    styleProp = styleProp.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `${styleProp}:{{${styleValue}}}`;
}

const ES6_STRING_VAR_PLACEHOLDER = '<@%#!=>';
const ES6_STRING_VAR_REGEXP = new RegExp(ES6_STRING_VAR_PLACEHOLDER, 'g');

/**
 * Parse template style binding value
 *
 * @param {string} bindingValue the style binding value to parse
 * @return {Array.<string>}
 */
exports.parseBindingStyleValue = function (bindingValue) {
    let value = bindingValue
        .trim()
        .replace(/^\[|]$/g, '');

    // remove {} except for es6 string variable {}
    const strPlaceHolders = [];
    value = value.replace(/\${.+?}/g, match => {
        strPlaceHolders.push(match);
        return ES6_STRING_VAR_PLACEHOLDER;
    }).replace(/[{}]/g, '').replace(
        ES6_STRING_VAR_REGEXP,
        () => strPlaceHolders.shift()
    );

    const result = [];
    const commaRegex = /,/g;
    let startIdx = 0;
    const len = value.length;
    while (startIdx < len) {
        let styleProp;
        let match = commaRegex.exec(value);
        if (!match) {
            styleProp = value.substr(startIdx);
            startIdx = value.length;
        }
        else if (isValidatedStylePropSeperator(value, startIdx, match.index)) {
            styleProp = value.substring(startIdx, match.index);
            startIdx = match.index + 1;
        }
        else {
            continue;
        }

        let styleInfo = parseStyleProp(styleProp);
        styleInfo && result.push(styleInfo);
    }

    return result;
};
