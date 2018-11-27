/**
 * @file Build mini program base config
 * @author ${author|raw}
 */

'use strict';

const path = require('path');

const DEV_SERVER_PORT = 9090;

module.exports = {
    verbose: false,
    root: path.join(__dirname, '..'),
    output: {
        dir: 'dist',
        depDir: 'src/common'
    },
    component: {
        extname: '${sfcExt}',
        template: {
            <% if: ${h5tag} %>
            transformTags: {
                // div p 等 将转为 view 标签
                // span 标签转为 view 且加上 okam-inline class属性
                // .okam-inline 在 入口样式中自行编写
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
                // a 将标签转为 navigator 标签，href 属性 转为 url 属性
                navigator: {
                    tag: 'a',
                    href: 'url'
                },
                // img 将转为 image 标签
                image: 'img'
            }
            <% /if %>
        }
    },
    framework: [
        'data',
        'watch',
        'broadcast',
        'ref',
        <% if: ${redux} %>
        'redux'
        <% /if %>
    ],
    processors: {
        <% if: ${script} === 'typescript' %>
        babel7: {
            extnames: ['js', 'ts']
        },
        <% elif: ${script} === 'babel7' %>
        babel7: {
            extnames: ['js']
        },
        <% else %>
        babel: {
            extnames: ['js']
        },
        <% /if %>
        <% if: ${template} === 'pug' %>
        pug: {
            extnames: ['pug', 'tpl'],
            options: {
                doctype: 'xml',
                data: {
                    name: 'efe'
                }
            }
        },
        // 定义小程序模板转换的文件后缀名
        view: {
            <% if: ${template} === 'pug' %>
            extnames: ['pug', 'tpl']
            <% else %>
            extnames: ['tpl']
            <% /if %>
        },
        <% /if %>
        postcss: {
            extnames: ['${styleExt}'],
            options: {
                <% if: ${px2rpx} %>
                plugins: {
                    px2rpx: {
                        // 设计稿尺寸
                        designWidth: 1242
                    }
                }
                <% /if %>
            }
        }
    },

    <% if: ${server} %>
    // 启用开发 Server
    server: {
        port: DEV_SERVER_PORT,
        type: 'connect',
        // 需要安装 mock 中间件 npm i autoresponse --save-dev
        middlewares: [
            // name: 'autoresponse',
            // options: {

            //}
        ]
    },
    <% /if %>

    prod: {
        rules: [
            {
                match: '*.js',
                processors: [
                    ['replacement', {'process.env.NODE_ENV': '"production"'}]
                ]
            }
        ]
    },

    dev: {
        rules: [
            <% if: ${tinyimg} %>
            {
                match: /\.(png|jpe?g|gif)(\?.*)?$/,
                processors: {
                    tinyimg: {
                        replaceRaw: true
                    }
                }
            },
            <% /if %>
            {
                match: '*.js',
                processors: [
                    ['replacement', {
                        <% if: ${server} %>
                        // 'https://online.com': 'https://dev.com',
                        <% /if %>
                        'process.env.NODE_ENV': '"development"'
                    }]
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
                        <% if: ${server} %>
                        // 'https://online.com': 'https://test.com',
                        <% /if %>
                        'process.env.NODE_ENV': '"development"'
                    }]
                ]
            }
        ]
    }
};
