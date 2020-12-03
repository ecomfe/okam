/**
 * @file Build helper
 * @author sparklewhy@gmail.com
 */

'use strict';

function generateStyleLoaders(options, preprocessorLoaderName) {
    const loaders = [];
    let {postcss, css, sourceMap} = options;
    css && typeof css !== 'object' && (css = {});

    if (postcss) {
        loaders.push({
            loader: 'css-loader',
            options: Object.assign({sourceMap}, css, {
                importLoaders: 1
            })
        });
        loaders.push({
            loader: 'postcss-loader',
            options: Object.assign(
                {sourceMap},
                typeof postcss === 'object' ? postcss : null
            )
        });
    }
    else {
        loaders.push({
            loader: 'css-loader',
            options: Object.assign({sourceMap}, css)
        });
    }

    if (preprocessorLoaderName) {
        let loaderOpts = options[preprocessorLoaderName];
        typeof loaderOpts !== 'object' && (loaderOpts = null);
        const loaderName = preprocessorLoaderName + '-loader';
        if (loaderOpts && typeof loaderOpts === 'object') {
            loaders.push({
                loader: loaderName,
                options: loaderOpts
            });
        }
        else {
            loaders.push(loaderName);
        }
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
        let MiniCssExtractPlugin = require('mini-css-extract-plugin');
        return [MiniCssExtractPlugin.loader].concat(loaders);
    }

    return ['vue-style-loader'].concat(loaders);
}

/**
 * Get the css process rules
 *
 * @param {Object=} options the process options
 * @param {boolean=} options.sourceMap whether enable sourceMap, by default false
 * @param {boolean=} options.extract whether extract the css content to file, by default false
 * @param {Object} options.css the css loader options
 * @param {Object|boolean=} options.postcss whether enable postcss loader or pass the
 *        enabled postcss loader options
 * @param {Object|boolean=} options.less whether enable less loader or pass the
 *        enabled less loader options
 * @param {Object|boolean=} options.stylus whether enable stylus loader or pass the
 *        enabled stylus loader options
 * @param {Object|boolean=} options.sass whether enable sass loader or pass the
 *        enabled sass loader options
 * @return {Array.<Object>}
 */
exports.getStyleProcessRules = function (options) {
    options = options || {};

    return [
        {
            test: /\.css$/,
            use: generateStyleLoaders(options)
        },
        {
            test: /\.less$/,
            use: generateStyleLoaders(options, 'less')
        },
        {
            test: /\.s(a|c)ss$/,
            use: generateStyleLoaders(options, 'sass')
        },
        {
            test: /\.(stylus|styl)$/,
            use: generateStyleLoaders(options, 'stylus')
        }
    ];
};
