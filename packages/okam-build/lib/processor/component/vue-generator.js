/**
 * @file The Vue single file component generator for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

function wrapContent(wrapTag, file) {
    return `<${wrapTag}>\n${file.content.toString().trim()}\n</${wrapTag}>\n`;
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
