/**
 * @file Webpack prod config for build h5 app
 * @author sparklewhy@gmail.com
 */

'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
// npm install --save-dev @intervolga/optimize-cssnano-plugin
// const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

function getProdBuildConfig(options) {
    const {sourceMap} = options || {};
    const buildBaseConfig = baseWebpackConfig(options, {
        output: {
            filename: 'js/[name].[chunkhash:8].js',
            chunkFilename: 'js/[name].[chunkhash:8].js'
        },
        devtool: 'source-map',
        extractStyle: 'css/[name].[contenthash:8].css',
        htmlPlugin: {
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/jantimon/html-webpack-plugin#minification
            }
        }
    });

    // const TerserPlugin = require('terser-webpack-plugin');

    return merge(buildBaseConfig, {
        mode: 'production',

        plugins: [
            // keep module.id stable when vendor modules does not change
            new webpack.HashedModuleIdsPlugin()
        ],

        optimization: {

            // https://webpack.js.org/plugins/split-chunks-plugin/
            splitChunks: {
                cacheGroups: {
                    // styles: {
                    //     name: 'styles',
                    //     test: /\.css$/,
                    //     chunks: 'all',
                    //     enforce: true
                    // },
                    // common: {
                    //     chunks: 'initial',
                    //     minChunks: 2,
                    //     name: 'chunk-common',
                    //     priority: -20,
                    //     reuseExistingChunk: true
                    // },
                    vendors: {
                        chunks: 'initial',
                        name: 'chunk-vendors',
                        priority: -10,
                        test(module, chunks) {
                            return module.type === 'javascript/auto' && module.resource.indexOf('/src/npm/') !== -1;
                        }
                    }
                },
                automaticNameDelimiter: '_',
                chunks: 'all',
                name: false
            },

            minimizer: [
                // new TerserPlugin(terserOptions(options))
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: {
                            warnings: false
                        }
                    },
                    sourceMap,
                    parallel: true
                }),
                // Compress extracted CSS. We are using this plugin so that possible
                // duplicated CSS from different components can be deduped.
                new OptimizeCSSPlugin({
                    cssProcessorOptions: sourceMap
                        ? {safe: true, map: {inline: false}}
                        : {safe: true}
                })
                // new OptimizeCssnanoPlugin({
                //     sourceMap: false,
                //     cssnanoOptions: {
                //         preset: ['default', {
                //             cssDeclarationSorter: false,
                //             mergeLonghand: false
                //         }],
                //     },
                // }),
            ]
        }
    }, options.mergeOptions || {});
}

module.exports = getProdBuildConfig;
