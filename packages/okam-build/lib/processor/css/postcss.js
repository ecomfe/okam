/**
 * @file The postcss processor
 * @author xiaohong8023@outlook.com
 */

'use strict';

const path = require('path');
const postcss = require('postcss');
const normalizePlugins = require('../helper/plugin');

const BUILTIN_PLUGINS = {
    autoprefixer: {
        deps: ['autoprefixer'],
        options: {
            browsers: [
                'last 3 versions',
                'iOS >= 8',
                'Android >= 4.1'
            ]
        }
    },
    px2rpx: {
        path: path.join(__dirname, 'postcss-plugin-px2rpx.js'),
        options: {
            designWidth: 750,
            precision: 2
        }
    }
};

module.exports = function (file, options) {
    let {root, config} = options;
    let plugins = normalizePlugins(config.plugins, BUILTIN_PLUGINS, root);

    plugins = (plugins || []).map(
        ({handler, options}) => handler(options)
    );
    let {css, map} = postcss(plugins)
        .process(
            file.content.toString(),
            {
                from: file.fullPath
            }
        );

    return {
        content: css,
        deps: map
    };
};

