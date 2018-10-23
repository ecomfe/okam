/**
 * @file The postcss processor
 * @author xiaohong8023@outlook.com
 */

'use strict';

const path = require('path');
const postcss = require('postcss');
const normalizePlugins = require('../helper/plugin');
const relative = require('../../util').file.relative;

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
        path: path.join(__dirname, 'plugins', 'postcss-plugin-px2rpx.js'),
        options: {
            designWidth: 750,
            precision: 2
        }
    },
    cssImport: {
        path: path.join(__dirname, 'plugins', 'postcss-plugin-import.js')
    }
};

module.exports = function (file, options) {
    let {root, config} = options;
    let plugins = normalizePlugins(config.plugins, BUILTIN_PLUGINS, root);

    plugins = (plugins || []).map(
        ({handler, options}) => handler(options)
    );
    let {css, result} = postcss(plugins)
        .process(
            file.content.toString(),
            {
                from: file.fullPath
            }
        );

    // normalize dep path relative to root
    let deps = result.deps;
    if (deps) {
        deps = deps.map(
            item => relative(path.join(path.dirname(file.fullPath), item), root)
        );
    }

    return {
        content: css,
        deps
    };
};

