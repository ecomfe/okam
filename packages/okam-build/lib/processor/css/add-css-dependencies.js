/**
 * @file Add the style dependence
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const {relative} = require('../../util').file;

module.exports = function (file, options) {
    let {config} = options;
    let content = file.content.toString();
    let {styleFiles} = config;
    let dirName = path.dirname(file.fullPath);

    // add css style dependencies
    styleFiles && styleFiles.forEach(item => {
        let relPath = relative(item, dirName);
        content = `@import '${relPath}';\n` + content;
    });

    return {
        content
    };
};
