/**
 * @file The single file component parser
 * @author sparklewhy@gmail.com
 */

'use strict';

const compiler = require('vue-template-compiler');
const helper = require('./helper');

function initPartFileInfo(file, ...parts) {
    let addPart = part => {
        if (part) {
            file.addSubFile(part);
        }
    };

    parts.forEach(item => {
        if (Array.isArray(item)) {
            for (let k = 0, len = item.length; k < len; k++) {
                addPart(item[k]);
            }
        }
        else {
            addPart(item);
        }
    });
}

/**
 * Parse the single file component.
 * Return the component file info:
 * {
 *     template: Object,
 *     script: Object,
 *     styles: Array.<Object>,
 *     customBolcks: Array.<string>
 * }
 *
 * @param {Object} file the file to process
 * @param {string} file.content the component file content
 * @param {Object=} options the parse options, optional
 * @return {Object}
 */
function parse(file, options) {
    let result = compiler.parseComponent(
        file.content.toString(), Object.assign({}, {pad: 'line'}, options && options.config)
    );

    let tplFile = helper.getComponentPartFile(result.template, {
        isTemplate: true,
        root: options.root,
        filePath: file.fullPath
    });

    let scriptFile = helper.getComponentPartFile(result.script, {
        isScript: true,
        root: options.root,
        filePath: file.fullPath
    });

    let styleFiles = result.styles.map(
        (item, index) => helper.getComponentPartFile(item, {
            isStyle: true,
            index,
            root: options.root,
            filePath: file.fullPath
        })
    );

    initPartFileInfo(file, tplFile, scriptFile, styleFiles);

    // fix pad line missing when lang is set in script part
    if (scriptFile) {
        scriptFile.content = scriptFile.content.replace(
            /^\n+/, match => match.replace(/\n/g, '//\n')
        );
    }

    return {
        isComponent: true,
        tpl: tplFile,
        script: scriptFile,
        styles: styleFiles
    };
}

module.exports = exports = parse;
