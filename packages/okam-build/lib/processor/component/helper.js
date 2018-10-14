/**
 * @file the parser helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */

const path = require('path');
const {createFile} = require('../FileFactory');
const {getProcessorProcessExtname} = require('../type');

exports.getComponentPartFile = function (part, options) {
    if (!part) {
        return;
    }

    let {lang, filePath, root, isScript, isStyle, isTemplate, index} = options;
    let fullPath;
    let content;
    let isVirtual = true;
    if (part.src) {
        let dir = path.dirname(filePath);
        fullPath = path.resolve(dir, part.src);
        isVirtual = false;
    }
    else {
        content = part.content;
    }

    part.lang && (lang = part.lang);
    if (!fullPath) {
        let extname = getProcessorProcessExtname(lang);
        if (!extname) {
            if (lang) {
                extname = lang;
            }
            else if (isScript) {
                extname = 'js';
            }
            else if (isStyle) {
                extname = 'css';
            }
            else if (isTemplate) {
                extname = 'tpl';
            }
        }

        if (typeof index === 'number') {
            fullPath = filePath + '.' + index;
        }
        else {
            fullPath = filePath;
        }
        fullPath += '.' + (extname || 'part');
    }

    return createFile({
        isVirtual,
        isScript,
        isStyle,
        isTemplate,
        fullPath,
        data: content
    }, root);
};
