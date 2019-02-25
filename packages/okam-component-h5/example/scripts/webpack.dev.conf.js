/**
 * @file webpack dev config
 * @author xxx
 */

'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');

const HOST = '0.0.0.0';
const PORT = 8080;

module.exports = merge(baseConfig, {
    mode: 'development',

    devServer: {
        clientLogLevel: 'warning',
        hot: true,
        contentBase: 'dist',
        compress: true,
        host: HOST,
        useLocalIp: true,
        port: PORT,
        open: true,
        overlay: {warnings: false, errors: true},
        publicPath: '/',
        quiet: true
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.styl(us)?$/,
                use: ['vue-style-loader', 'css-loader', 'stylus-loader']
            }
        ]
    },

    plugins: [new webpack.HotModuleReplacementPlugin()]
});
