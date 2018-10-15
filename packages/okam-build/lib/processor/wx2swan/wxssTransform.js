/**
 * @file The postcss processor
 * @author xiaohong8023@outlook.com
 */

'use strict';

const postcssProcessor = require('../css/postcss');
const wx2swanPlugin = require('../css/postcss-plugin-wx2swan');

module.exports = function (file, options) {
    let config = options.config;
    config.plugins = config.plugins || [];
    config.plugins.push(wx2swanPlugin.bind(this, {file}));
    return postcssProcessor(file, options);
};

