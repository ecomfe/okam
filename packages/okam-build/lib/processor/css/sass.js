/**
 * @file The sass processor
 * @author xiaohong8023@outlook.com
 */

'use strict';


const path = require('path');
const sass = require('node-sass');

module.exports = function (file, options) {
    let {config, root} = options;

    // if file.exname is sass, indentedSyntax is true
    // true values enable Sass Indented Syntax for parsing the data string or file.
    // see https://www.npmjs.com/package/node-sass
    config = Object.assign({
        indentedSyntax: (file.extname === 'sass'),
        data: file.content.toString(),
        file: path.basename(file.fullPath)
    }, config);

    // init the paths to search
    let confPaths = config.includePaths || [];
    [file.dirname, root].forEach(item => {
        if (!confPaths.includes(item)) {
            confPaths.push(item);
        }
    });
    config.includePaths = confPaths;

    let result = sass.renderSync(config);

    return {
        content: result.css.toString(),
        deps: result.stats.includedFiles
    };
};
