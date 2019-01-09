/**
 * @file The quick app single file component parser
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const sfcParser = require('./sfc-parser');

/**
 * Parse the quick app single file component.
 * Return the component file info:
 * {
 *     tpl: Object,
 *     script: Object,
 *     styles: Array.<Object>,
 *     customBlocks: Array.<Object>
 * }
 *
 * @param {Object} file the file to process
 * @param {string} file.content the component file content
 * @param {Object=} options the parse options, optional
 * @return {Object}
 */
function parse(file, options) {
    let result = sfcParser(file, options);
    let fileDir = path.dirname(file.fullPath);
    let {addFile} = options;
    let importComponents = {};
    let {customBlocks} = result;
    customBlocks && customBlocks.forEach(item => {
        let {type, attrs} = item;
        if (attrs && type === 'import') {
            let {name, src} = attrs;
            importComponents[name] = src;

            src && addFile(path.join(
                fileDir, src + '.ux'
            ));
        }
    });

    file.importComponents = importComponents;
    return result;
}

module.exports = exports = parse;
