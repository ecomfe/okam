/**
 * @file The less processor
 * @author sparklewhy@gmail.com
 */

'use strict';

const less = require('less');

module.exports = function (file, options) {
    let {logger, config, root} = options;

    // init config
    config = Object.assign({
        filename: file.path,
        syncImport: true,
        relativeUrls: true
        // rewriteUrls: 'all'
    }, config);

    // init the paths info for less find
    let confPaths = config.paths || [];
    [file.dirname, root].forEach(item => {
        if (confPaths.indexOf(item) === -1) {
            confPaths.push(item);
        }
    });
    config.paths = confPaths;

    let processResult = {};
    less.render(file.content.toString(), config, (err, result) => {
        if (err) {
            logger.error(`parse less file ${file.path} fail:`, err);
            throw err;
        }
        processResult.content = result.css;
        processResult.deps = result.imports;
    });
    return processResult;
};
