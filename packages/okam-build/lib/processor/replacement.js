/**
 * @file Replacement processor
 * @author sparklewhy@gmail.com
 */

'use strict';

const strUtil = require('../util').string;

function replaceContent(str, match, replacement) {
    if (match === replacement) {
        return str;
    }

    if (typeof match === 'string') {
        // by default replace all matched content if the match is string
        while (str.indexOf(match) !== -1) {
            str = str.replace(match, replacement);
        }
    }
    else {
        str = str.replace(match, replacement);
    }
    return str;
}

function doReplacement(content, rules, file) {
    const server = require('../server').getInstance();
    let tplData = {};
    if (server) {
        tplData.devServer = server.getHost();
    }

    let result = content;
    if (Array.isArray(rules)) {
        rules.forEach(item => {
            if (typeof item === 'function') {
                result = item(result, file.path);
            }
            else if (typeof item === 'object') {
                let {match, replace} = item;
                replace = strUtil.format(replace, tplData, false);
                result = replaceContent(result, match, replace);
            }
        });
    }
    else if (typeof rules === 'object') {
        Object.keys(rules).forEach(k => {
            let value = rules[k];
            if (typeof value !== 'string') {
                value = '' + value;
            }

            let replace = strUtil.format(value, tplData, false);
            result = replaceContent(result, k, replace);
        });
    }

    return result;
}

/**
 * Replacement the file content using the given pattern
 *
 * @param {Object} file the file to process
 * @param {Object} options the compile options
 * @return {{content: string}}
 */
function process(file, options) {
    let content = file.content.toString();
    let {config: rules, logger} = options;

    let result = content;
    try {
        result = doReplacement(content, rules || [], file);
    }
    catch (ex) {
        let tip;
        if (ex === 'devServer') {
            tip = ', you need to enable dev server to get this info';
        }
        logger.error('unknown replacement variable:', ex + (tip || ''));
    }

    return {
        content: result
    };
}

module.exports = exports = process;
