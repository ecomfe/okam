/**
 * @file The single file component parser
 * @author sparklewhy@gmail.com
 */

'use strict';

const compiler = require('vue-template-compiler');
const {replaceExtname} = require('../../util').file;
const helper = require('./helper');

function createPartFile(ownerFile, partInfo, opts, deps) {
    let file = helper.getComponentPartFile(partInfo, opts);
    if (!file) {
        return;
    }

    let {resolvePath} = ownerFile;
    if (resolvePath) {
        file.resolvePath = replaceExtname(resolvePath, file.extname);
    }

    if (file.isStyle) {
        file.scoped = partInfo.scoped;
    }


    ownerFile.addSubFile(file);

    !file.isVirtual && deps.push(file.fullPath);

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
    let {root, config, getFileByFullPath} = options;
    let parseOpts = Object.assign({}, {pad: 'line'}, config && config.parse);
    let result = compiler.parseComponent(
        file.content.toString(), parseOpts
    );

    let {customBlocks} = result;

    let deps = [];
    let {fullPath: filePath} = file;
    let tplFile = createPartFile(file, result.template, {
        isTemplate: true,
        root,
        getFileByFullPath,
        filePath
    }, deps);

    let scriptFile = createPartFile(file, result.script, {
        isScript: true,
        root,
        getFileByFullPath,
        filePath
    }, deps);

    let styleFiles = result.styles.map(
        (item, index) => createPartFile(file, item, {
            isStyle: true,
            index,
            root,
            getFileByFullPath,
            filePath
        }, deps)
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
        deps,
        isSfcComponent: true,
        customBlocks,
        tpl: tplFile,
        script: scriptFile,
        styles: styleFiles
    };
}

module.exports = exports = parse;
