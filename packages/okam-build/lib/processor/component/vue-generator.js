/**
 * @file The Vue single file component generator for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

const {file: fileUtil} = require('../../util');
const {getRequirePath, replaceExtname} = fileUtil;

function wrapContent(wrapTag, file) {
    let tagAttrs = '';
    if (file.isStyle && file.scoped) {
        tagAttrs = ' scoped';
    }

    if (file.isVirtual || file.isTpl) {
        return `<${wrapTag}${tagAttrs}>\n${file.content.toString().trim()}\n</${wrapTag}>\n`;
    }

    file.release = true;
    let ownerFile = file.owner;
    let srcPath = getRequirePath(
        file.resolvePath || file.path, ownerFile.resolvePath || ownerFile.path,
        true
    );

    let rext = file.isStyle ? 'css' : 'js';
    srcPath = replaceExtname(srcPath, file.rext || rext);
    return `<${wrapTag}${tagAttrs} src="${srcPath}"></${wrapTag}>\n`;
}

/**
 * Generate the single file component.
 * Return the component file info structure:
 * <template>...</template>
 * <script>...</script>
 * <style>...</style>
 *
 * @param {Object} file the file to process
 * @param {string} file.content the component file content
 * @param {Object=} options the parse options, optional
 * @return {Object}
 */
function generateSFC(file, options) {
    let {subFiles} = file;
    if (!subFiles || !subFiles.length) {
        subFiles = [file];
    }

    let result = '';
    subFiles.forEach((item, idx) => {
        if (item.isScript) {
            result += wrapContent('script', item);
        }
        else if (item.isStyle) {
            result += wrapContent('style', item);
        }
        else if (item.isTpl) {
            result += wrapContent('template', item);
        }
    });

    return {
        content: result
    };
}

module.exports = exports = generateSFC;
