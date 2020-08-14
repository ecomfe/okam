/**
 * @file Replacement processor
 * @author sparklewhy@gmail.com
 */

'use strict';

const strUtil = require('../util').string;

function replaceContent(content, match, replacement) {
    if (match === replacement) {
        return content;
    }

    if (typeof match === 'string') {
        match = strUtil.escapeRegExp(match);
        content = content.replace(new RegExp(match, 'g'), replacement);
    }
    else {
        content = content.replace(match, replacement);
    }

    return content;
}

function doReplacement(content, rules, file) {
    const server = require('../server').getInstance();
    let tplData = {};
    if (server) {
        tplData.devServer = server.getHost();
    }

    let result = content;
    let upContent = (match, replacement) => {
        replacement = strUtil.format(replacement, tplData, false);
        result = replaceContent(result, match, replacement);
    };

    if (Array.isArray(rules)) {
        rules.forEach(item => {
            if (typeof item === 'function') {
                result = item(result, file.path);
            }
            else if (typeof item === 'object') {
                let {match, replace} = item;
                upContent(match, replace);
            }
        });
    }
    else if (typeof rules === 'object') {
        Object.keys(rules).forEach(match => {
            let replace = rules[match];
            if (typeof replace !== 'string') {
                replace = '' + replace;
            }

            upContent(match, replace);
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
            tip = ', please execute `npm run dev:server` script or start with `--server` option';
        }
        logger.error('unknown replacement variable:', ex + (tip || ''));
    }

    return {
        content: result
    };
}

module.exports = exports = process;
