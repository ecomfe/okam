/**
 * @file Add the style dependence
 * @author sparklewhy@gmail.com
 */

'use strict';

const {relative, replaceExtname} = require('../../util').file;

module.exports = function (file, options) {
    let {config, resolve} = options;
    let content = file.content.toString();
    let {styleFiles, rext} = config;
    let dirName = file.dirname;

    // add css style dependencies
    styleFiles && styleFiles.forEach(item => {
        let relPath = relative(item, dirName);
        relPath = resolve(file, relPath);
        rext && (relPath = replaceExtname(relPath, rext));
        content = `@import '${relPath}';\n` + content;
    });

    return {
        content
    };
};
