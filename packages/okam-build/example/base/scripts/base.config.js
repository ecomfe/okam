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
            transformTags: {
                div: 'view',
                p: 'view',
                ul: 'view',
                ol: 'view',
                li: 'view',
                // span 会被转为 view 标签，若想让它拥有 inline 属性，可通过 配置 class 值如：okam-inline 进行 样式属性控制
                // 注：okam-inline 样式 需自行在样式文件(app.css)中定义
                // 最终 view 标签 class 将额外添加 okam-inline 值，而不是覆盖
                span: {
                    tag: 'view',
                    class: 'okam-inline'
                },
                strong: {
                    tag: 'view',
                    class: 'okam-inline'
                },
                h1: 'view',
                h2: 'view',
                h3: 'view',
                h4: 'view',
                h5: 'view',
                h6: 'view',
                article: 'view',
                section: 'view',
                aside: 'view',
                nav: 'view',
                header: 'view',
                footer: 'view',
                pre: 'view',
                code: 'view',

                // Object
                // eg
                //     <a class="home-link" href='xxx'></a>
                // 转为:
                //     <navigator class="okam-inline home-link" url='xxx'></navigator>
                a: {
                    tag: 'navigator',
                    class: 'okam-inline',
                    href: 'url'
                },

                // string
                img: 'image'
            }
        }
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
