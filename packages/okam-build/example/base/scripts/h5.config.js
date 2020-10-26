/**
 * @file Build h5 app build config
 * @author <author>
 */

'use strict';

const path = require('path');
const {merge} = require('../../../');
const OUTPUT_DIR = 'h5_dist';

/**
 * 不 merge 属性选择器，即直接覆盖属性值
 *
 * @type {Array.<string>}
 */
const overridePropertySelectors = [
    'component.template',
    'processors.postcss.options.plugins'
];

module.exports = merge({}, require('./base.config'), {
    output: {
        dir: OUTPUT_DIR,
        depDir: {
            node_modules: 'src/npm',
            dep: 'src/npm'
        }
    },

    polyfill: ['async'],

    framework: ['filter'],

    component: {
        template: {
            useVuePrefix: true,
            transformTags: {
                a: {
                    tag: 'navigator',
                    href: 'url'
                }
                // text: 'span',
                // image: 'img'
            }
        }
    },

    processors: {
        postcss: {
            extnames: ['css', 'styl', 'less'],
            options: {
                plugins: [
                    [
                        'autoprefixer',
                        {
                            'overrideBrowserslist': [
                                '> 1%',
                                'last 2 versions',
                                'not ie <= 8'
                            ]
                        }
                    ],
                    'postcss-url',
                    [
                        'px2rem',
                        {
                            keepComment: 'no'
                        }
                    ],
                    // 'postcss-import-sync2',
                    'env'
                ]
            }
        }
    },

    webpack: {
        htmlPlugin: {
            template: path.join(__dirname, 'h5/index.html')
        },
        mergeOptions: {
            resolveLoader: {
                modules: [
                    // 确保软链 okam-build-h5 能正确找到 loader 定义
                    path.join(require.resolve('okam-build-h5'), '..', 'node_modules'),
                    'node_modules'
                ]
            }
        }
    }
}, overridePropertySelectors);
