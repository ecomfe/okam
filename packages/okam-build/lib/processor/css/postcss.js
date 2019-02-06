/**
 * @file The postcss processor
 * @author xiaohong8023@outlook.com
 */

'use strict';

const path = require('path');
const postcss = require('postcss');
const {normalizePlugins} = require('./plugins/helper');

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
    env: {
        path: path.join(__dirname, 'plugins', 'postcss-plugin-env.js')
    },
    resource: {
        path: path.join(__dirname, 'plugins', 'postcss-plugin-resource.js')
    },
    quickcss: {
        path: path.join(__dirname, 'plugins', 'postcss-plugin-quickcss.js')
    }
};

module.exports = function (file, options) {
    let {
        root,
        appType,
        allAppTypes,
        designWidth,
        config,
        output,
        resolve,
        logger
    } = options;
    let styleExtname = output.componentPartExtname
        && output.componentPartExtname.style;

    // init default design width
    if (designWidth) {
        BUILTIN_PLUGINS.px2rpx.options.designWidth = designWidth;
    }

    let plugins = config.plugins || [];
    if (!Array.isArray(plugins)) {
        plugins = Object.keys(plugins).map(
            k => ({name: k, options: plugins[k]})
        );
    }
    plugins.unshift('resource');
    plugins = normalizePlugins(plugins, BUILTIN_PLUGINS, root);

    if (!plugins || !plugins.length) {
        // skip process if none plugins provided
        return {
            content: file.content
        };
    }

    plugins = (plugins || []).map(
        ({name, handler, options, noInit}) => {
            if (noInit) {
                return handler;
            }

            let pluginOpts = Object.assign({
                allAppTypes,
                appType,
                styleExtname,
                filePath: file.path,
                logger
            }, options);

            if (name === 'resource') {
                Object.assign(pluginOpts, {file, resolve});
            }
            return handler(pluginOpts);
        }
    );
    let {css} = postcss(plugins)
        .process(
            file.content.toString(),
            {
                from: file.fullPath
            }
        );

    return {
        content: css,
        rext: styleExtname
    };
};

