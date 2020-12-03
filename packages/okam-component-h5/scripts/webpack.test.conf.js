/**
 * @file Webpack test config
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global __dirname: false */
/* global module: false */

const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');

module.exports = {
    mode: 'development',
    devtool: 'inline-cheap-module-source-map',
    // output: {
    //     // ...
    //     // use absolute paths in sourcemaps (important for debugging via IDE)
    //     devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    //     devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    // },
    resolve: {
        alias: {
            '@': path.join(__dirname, '../src')
            // 'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.js', '.vue', '.json']
    },
    module: {
        noParse: /^vue$/,
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};
