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
    },
    env: {
        path: path.join(__dirname, 'plugins', 'postcss-plugin-env.js')
    }
};

module.exports = function (file, options) {

    let {root, appType, allAppTypes, designWidth, config, output} = options;
    let appTypeStylExtname = output.componentPartExtname.style;

    // init default design width
    if (designWidth) {
        BUILTIN_PLUGINS.px2rpx.options.designWidth = designWidth;
    }

    let plugins = normalizePlugins(config.plugins, BUILTIN_PLUGINS, root);

    plugins = (plugins || []).map(({handler, options}) => handler(
        Object.assign({
            allAppTypes,
            appType,
            appTypeStylExtname
        },
        options)
    ));
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

