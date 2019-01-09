/**
 * @file The single file component generator
 * @author sparklewhy@gmail.com
 */

'use strict';

function wrapContent(wrapTag, file) {
    return `<${wrapTag}>\n${file.content.toString().trim()}\n</${wrapTag}>\n`;
}

function addImportComponents(tpl, componentConfig) {
    componentConfig && Object.keys(componentConfig).forEach(k => {
        let path = componentConfig[k];
        tpl = `<import name="${k}" src="${path}"></import>\n` + tpl;
    });
    return tpl;
}

function getComponentConfig(files) {
    let found;
    files.some(item => {
        if (item.isConfig) {
            found = item;
            return true;
        }
        return false;
    });

    if (found) {
        let config = JSON.parse(found.content);
        return config.usingComponents;
    }
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
    let componentConfig = file.isNativeComponent
        ? file.importComponents
        : getComponentConfig(subFiles);

    subFiles.forEach((item, idx) => {
        if (item.isScript) {
            result += wrapContent('script', item);
        }
        else if (item.isStyle) {
            result += wrapContent('style', item);
        }
        else if (item.isTpl) {
            result += wrapContent('template', item);
            result = addImportComponents(result, componentConfig);
        }
    });

    return {
        content: result
    };
}

module.exports = exports = generateSFC;
