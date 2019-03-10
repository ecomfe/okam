/**
 * @file Base webpack config for build h5 app
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const helper = require('./helper');

function resolvePaths(opts, resolveAttrs, resolve) {
    resolveAttrs.forEach(k => {
        let value = opts[k];
        value && (opts[k] = resolve(value));
    });
}

function getPlugins(options) {
    const {
        extractStyle,
        resolveAssetPath,
        htmlPluginOpts,
        errorPluginOpts
    } = options;
    const VueLoaderPlugin = require('vue-loader/lib/plugin');
    // const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

    const plugins = [
        new VueLoaderPlugin(),
        // new CaseSensitivePathsPlugin(),
        // https://github.com/jantimon/html-webpack-plugin#options
        new HtmlWebpackPlugin(htmlPluginOpts)
    ];

    if (extractStyle) {
        let MiniCssExtractPlugin = require('mini-css-extract-plugin');
        plugins.push(new MiniCssExtractPlugin({
            filename: resolveAssetPath(extractStyle),
            chunkFilename: resolveAssetPath(extractStyle)
        }));
    }

    // enable bundle analyze
    if (options.analyzeBundle) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        plugins.push(new BundleAnalyzerPlugin());
    }

    plugins.push(new FriendlyErrorsPlugin(errorPluginOpts));

    return plugins;
}

/**
 * Get the webpack build base config
 *
 * @param {Object} options the build options
 * @param {Object} options.output the webpack output options
 * @param {string} options.root the webpack root option
 * @param {Object=} options.resolve the webpack resolve option
 * @param {string=} options.devtool the webpack devtool option
 * @param {Object=} options.devServer the webpack devserver option
 * @param {string=} options.assetSubDir the asset sub dir, optional, by default `static`
 * @param {boolean=} options.sourceMap whether enable sourceMap
 * @param {number=} options.assetBase64Limit the static asset inline limit size
 *        optional, default 4096byte
 * @param {boolean=} options.extractStyle whether extract style to a single file
 * @param {Object=} options.htmlPlugin the html plugin options
 * @param {Object=} options.errorPlugin the FriendlyErrorsPlugin plugin options
 * @param {Object=} options.loader the loader options
 * @param {Object=} options.loader.vue the vue loader options
 * @param {Object} options.loader.css the css loader options
 * @param {Object|boolean=} options.loader.postcss whether enable postcss loader or pass the
 *        enabled postcss loader options
 * @param {Object|boolean=} options.loader.less whether enable less loader or pass the
 *        enabled less loader options
 * @param {Object|boolean=} options.loader.stylus whether enable stylus loader or pass the
 *        enabled stylus loader options
 * @param {Object|boolean=} options.loader.sass whether enable sass loader or pass the
 *        enabled sass loader options
 * @param {Object} defaultOpts the default options
 * @param {Object} defaultOpts.output the default output option
 * @param {string} defaultOpts.devtool the default devtool value
 * @param {boolean|string=} defaultOpts.extractStyle whether extract style to
 *        separation file or specify the extract style file name
 * @param {Object=} defaultOpts.htmlPlugin the default html plugin options
 * @param {boolean=} options.analyzeBundle whether analyze bundle size
 * @param {Object=} options.mergeOptions the custom webpack merge options
 * @return {Object}
 */
function getBaseConfig(options, defaultOpts) {
    let {
        root,
        entry,
        assetSubDir = 'static',
        extractStyle,
        sourceMap,
        loader = {},
        htmlPlugin,
        errorPlugin,
        resolve: resolveOpts,
        devtool,
        analyzeBundle,
        assetBase64Limit = 4096,
        devServer
    } = options;
    const resolveAssetPath = assetPath => path.posix.join(assetSubDir, assetPath);
    const {extensions, alias} = resolveOpts || {};
    const outputOpts = Object.assign({}, defaultOpts.output, options.output);
    resolvePaths(outputOpts, ['filename', 'chunkFilename'], resolveAssetPath);

    if (extractStyle == null) {
        extractStyle = defaultOpts.extractStyle;
    }

    const htmlPluginOpts = Object.assign({
        filename: 'index.html', // The file to write the HTML to.
        inject: true,
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'auto'
    }, defaultOpts.htmlPlugin, htmlPlugin);

    const imgFileLoader = {
        loader: 'file-loader',
        options: {
            name: resolveAssetPath('img/[name].[hash:8].[ext]')
        }
    };

    return {
        context: root,
        entry: Object.assign({
            app: './src/main.js'
        }, entry),
        output: Object.assign({
            path: path.join(root, 'dist'),
            publicPath: '/'
        }, outputOpts),
        resolve: {
            alias,
            extensions: extensions || ['.js', '.vue', '.json']
        },
        // cheap-module-eval-source-map is faster for development
        devtool: sourceMap ? (devtool || defaultOpts.devtool) : false,
        // https://webpack.js.org/configuration/dev-server/
        devServer,
        node: {
            /* eslint-disable fecs-camelcase */
            child_process: 'empty',
            dgram: 'empty',
            fs: 'empty',
            net: 'empty',
            process: 'mock',
            setImmediate: false,
            tls: 'empty'
        },
        module: {
            // noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: loader.vue
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                {
                    test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: assetBase64Limit,
                        fallback: imgFileLoader
                    }
                },
                {
                    test: /\.(svg)(\?.*)?$/,
                    ...imgFileLoader
                },
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: assetBase64Limit,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: resolveAssetPath('media/[name].[hash:8].[ext]')
                            }
                        }
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: assetBase64Limit,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: resolveAssetPath('fonts/[name].[hash:8].[ext]')
                            }
                        }
                    }
                }
            ].concat(helper.getStyleProcessRules(
                Object.assign({sourceMap}, loader, {extract: !!extractStyle})
            ))
        },
        plugins: getPlugins({
            extractStyle,
            resolveAssetPath,
            htmlPluginOpts,
            errorPluginOpts: errorPlugin,
            analyzeBundle
        })
    };
}

module.exports = getBaseConfig;
