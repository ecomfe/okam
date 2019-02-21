/**
 * @file Webpack dev config for build h5 app
 * @author sparklewhy@gmail.com
 */

'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');

function getDevBuildConfig(options) {
    const buildBaseConfig = baseWebpackConfig(options, {
        output: {filename: '[name].js'},
        devtool: 'cheap-module-eval-source-map'
    });

    return merge(buildBaseConfig, {
        mode: 'development',

        plugins: [
            new webpack.HotModuleReplacementPlugin()
            // copy custom static assets
            // https://github.com/webpack-contrib/copy-webpack-plugin
            // new CopyWebpackPlugin(),
        ]
    }, options.mergeOptions || {});
}

module.exports = getDevBuildConfig;
