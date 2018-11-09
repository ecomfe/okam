/**
 * @file Build mini program base config
 * @author xxx
 */

'use strict';

/* eslint-disable fecs-properties-quote */
const path = require('path');

module.exports = {
    verbose: false,
    root: path.join(__dirname, '..'),
    output: {
        dir: 'dist',
        depDir: 'src/common'
    },
    component: {
        extname: 'vue',
        template: {
            transformTags: {
                view: [
                    {
                        tag: 'strong',
                        class: 'okam-inline'
                    },
                    {
                        tag: 'span',
                        class: 'okam-inline'
                    },
                    'div', 'p',
                    'ul', 'ol', 'li',
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'article', 'section', 'aside', 'nav', 'header', 'footer',
                    'pre', 'code'
                ],
                navigator: {
                    tag: 'a',
                    href: 'url'
                },
                image: 'img'
            }
        }
    },
    framework: [
        'data',
        'watch',
        ['behavior', '{useNativeBehavior: true}'],
        'broadcast',
        'redux',
        'ref'
    ],
    processors: {
        pug: {
            options: {
                doctype: 'xml',
                data: {
                    name: 'efe-blue'
                }
            }
        },
        view: { // 定义小程序模板转换的文件后缀名
            extnames: ['pug', 'tpl']
        },
        postcss: {
            extnames: ['styl', 'less'],
            options: {
                plugins: {
                    autoprefixer: {
                    },
                    px2rpx: {
                        designWidth: 375
                    }
                }
            }
        }
    },
    rules: [
        // {
        //     match: 'node_modules/**/*.js',
        //     processors: [
        //         // 'babel7'
        //         {
        //             name: 'babel7',
        //             options: {
        //                 presets: ['@babel/preset-env'],
        //                 // plugins: ['external-helpers']
        //             }
        //         }
        //     ]
        // },
        // {
        //     match: 'src/**/*.{js,ts}',
        //     processors: [
        //         // 'babel7'
        //         {
        //             name: 'babel7',
        //             options: {
        //                 presets: ['@babel/preset-env'],
        //                 // plugins: ['external-helpers']
        //             }
        //         }
        //     ]
        // },
        // {
        //     match: 'src/**/*.ts',
        //     processors: [
        //         // 'babel7'
        //         {
        //             name: 'babel7',
        //             options: {
        //                 presets: ['@babel/preset-env'],
        //                 // plugins: ['external-helpers']
        //             }
        //         }
        //     ]
        // }
    ],

    server: {
        port: 9090,
        type: 'connect'
        // middlewares: [{
        //     name: 'autoresponse',
        //     options: {

        //     }
        // }]
    },

    dev: {
        rules: [
            {
                match: '*.js',
                processors: [
                    ['replacement', {
                        // 'https://smartapp.baidu.com': '${devServer}',
                        'https://my.baidu.com': 'https://dev.baidu.com',
                        'process.env.NODE_ENV': '"production"'
                    }]
                ]
            },
            {
                match: /\.(png|jpe?g|gif)(\?.*)?$/,
                processors: [
                    ['tinyimg', {replaceRaw: false, releaseSourcePath: 'doc/imgSource'}]
                ]
            }
        ]
    },

    test: {

        rules: [
            {
                match: '*.js',
                processors: [
                    ['replacement', {
                        // 'https://smartapp.baidu.com': '${devServer}',
                        'https://my.baidu.com': 'https://test.baidu.com',
                        'process.env.NODE_ENV': '"development"'
                    }]
                ]
            }
        ]
    }
};
