/**
 * @file Build mini program base config
 * @author xxx
 */

'use strict';

/* eslint-disable fecs-properties-quote */
const path = require('path');
const {defaultH5TagToMiniProgram} = require('../../../');

module.exports = {
    verbose: false,
    root: path.join(__dirname, '..'),
    output: {
        dir: 'dist',
        depDir: {
            node_modules: 'src/common',
            dep: 'src/common'
        }
    },
    component: {
        extname: 'vue',
        template: {
            useVuePrefix: true,
            modelMap: {
                'sp-model-component': {
                    event: 'spchange',
                    prop: 'spvalue',
                    detailProp: 'value'
                }
            },
            transformTags: defaultH5TagToMiniProgram
        }
    },
    api: {
        hi: './api/hi.js'
    },
    framework: [
        'data',
        'watch',
        'model',
        'vhtml',
        ['behavior', '{useNativeBehavior: true}'],
        'broadcast',
        'redux',
        'ref'
    ],
    designWidth: 375,
    resolve: {
        // alias: {
        //     'okam/': 'okam-core/src/na/',
        // },
        modules: ['node_modules', path.join(__dirname, '../dep')]
    },
    processors: {
        babel7: {
            extnames: 'js'
        },
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
                plugins: [/*'autoprefixer',*/ 'px2rpx', 'env']
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
        port: 8080,
        middlewares: [{
            name: 'autoresponse',
            options: {
                post: true
            }
        }]
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
