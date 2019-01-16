/**
 * @file Build mini program base config
 * @author xxx
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
        extname: 'vue',
        template: {
            // 标签转换配置项
            transformTags: {
            }
        }
    },
    framework: [
        'data',
        'watch',
        'broadcast',
        'ref'
    ],
    processors: {
        babel7: {
            extnames: ['js']
        },
        postcss: {
            extnames: ['css', 'styl'],
            options: {
                plugins: {
                    px2rpx: {
                        // 设计稿尺寸
                        designWidth: 1242,
                        noTrans1px: true
                    }
                }
            }
        }
    },

    // 启用开发 Server
    server: {
        port: DEV_SERVER_PORT,
        type: 'connect',
        // 需要安装 mock 中间件 npm i autoresponse --save-dev
        middlewares: [
            // {
            //     name: 'autoresponse',
            //     options: {
            //         post: true,
            //         get: true
            //     }
            // }
        ]
    },

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
            {
                match: /\.(png|jpe?g|gif)(\?.*)?$/,
                processors: {
                    tinyimg: {
                        replaceRaw: true
                    }
                }
            },
            {
                match: '*.js',
                processors: [
                    ['replacement', {
                        // 'https://online.com': 'https://dev.com',
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
                        // 'https://online.com': 'https://test.com',
                        'process.env.NODE_ENV': '"development"'
                    }]
                ]
            }
        ]
    }
};
