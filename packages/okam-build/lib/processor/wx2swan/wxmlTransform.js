/**
 * @file wxml2swan transform
 * @author xiaohong8023@outlook.com
 */

'use strict';


const viewProcessor = require('../component/template');
const wx2swanPlugin = require('../../template/transform/plugins/wx2swan-syntax-plugin');


/**
 * Compile template
 *
 * @param {Object} file the file to compile
 * @param {Object} options compile option
 * @param {Object} options.config compile config
 * @param {Object} options.config.plugins the template transform plugins
 * @return {Object}
 */
module.exports = function (file, options) {
    let config = options.config;
    config.plugins = config.plugins || [];
    config.plugins.push(wx2swanPlugin);

    return viewProcessor(file, options);
};
