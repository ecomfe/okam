/**
 * @file The single file component parser
 * @author sparklewhy@gmail.com
 */

'use strict';

const compiler = require('vue-template-compiler');
const {replaceExtname} = require('../../util').file;
const helper = require('./helper');

function createPartFile(ownerFile, partInfo, opts) {
    let file = helper.getComponentPartFile(partInfo, opts);
    if (!file) {
        return;
    }

    let {resolvePath} = ownerFile;
    if (resolvePath) {
        file.resolvePath = replaceExtname(resolvePath, file.extname);
    }

    ownerFile.addSubFile(file);

    return file;
}

/**
 * Parse the single file component.
 * Return the component file info:
 * {
 *     tpl: Object,
 *     script: Object,
 *     styles: Array.<Object>,
 *     customBlocks: Array
 * }
 *
 * @param {Object} file the file to process
 * @param {string} file.content the component file content
 * @param {Object=} options the parse options, optional
 * @return {Object}
 */
function parse(file, options) {
    let {root, config} = options;
    let parseOpts = Object.assign({}, {pad: 'line'}, config && config.parse);
    let result = compiler.parseComponent(
        file.content.toString(), parseOpts
    );

    let {customBlocks} = result;

    let {fullPath: filePath} = file;
    let tplFile = createPartFile(file, result.template, {
        isTemplate: true,
        root,
        filePath
    });

    let scriptFile = createPartFile(file, result.script, {
        isScript: true,
        root,
        filePath
    });

    let styleFiles = result.styles.map(
        (item, index) => createPartFile(file, item, {
            isStyle: true,
            index,
            root,
            filePath
        })
    );

    // fix pad line missing when lang is set in script part
    if (scriptFile && parseOpts.pad === 'line') {
        let content = scriptFile.content.toString();
        scriptFile.content = content.replace(
            /^\n+/, match => match.replace(/\n/g, '//\n')
        );
    }

    if (config && config.trim) {
        let content = scriptFile.content.toString();
        scriptFile.content = content.trim();
    }

    return {
        isSfcComponent: true,
        customBlocks,
        tpl: tplFile,
        script: scriptFile,
        styles: styleFiles
    };
}

module.exports = exports = parse;
