/**
 * @file The app entrance
 * @author xxx@baidu.com
 */

'use strict';

import store from './store/index';
// import a from 'a';

export default {
    // the app config defined in app.json
    config: {
        // The first element as the home page when app startup
        pages: [
            'pages/home/index',
            'pages/tpl/vueSyntax',
            'pages/tpl/tplSyntax',
            'pages/tpl/tplReuse',
            'pages/tpl/tplPug',
            'pages/tpl/ref',
            'pages/typescript/ts',
            'pages/component/componentPage',
            'pages/component/canvas',
            'pages/lifecycle/index',
            'pages/data/computed',
            'pages/data/init',
            'pages/data/array',
            'pages/data/watch',
            'pages/data/model',
            'pages/data/vhtml',
            'pages/todos/todoList',
            'pages/todos/counter',
            'pages/behavior/index',
            'pages/broadcast/index',
            'pages/filter/index',
            'pages/sfc/index',
            'pages/sfc/separate'
        ],
        subPackages: [
            {
                root: 'packageA',
                pages: [
                    'pages/subPageA/index'
                ]
            }, {
                root: 'packageB',
                pages: [
                    'pages/subPageB/index'
                ]
            }
        ],
        window: {
            navigationBarBackgroundColor: '#211E2E',
            navigationBarTextStyle: 'white',
            backgroundTextStyle: 'light',
            enablePullDownRefresh: false,
            backgroundColor: '#211E2E'
        },

        networkTimeout: {
            request: 30000
        },

        _quickEnv: {
            networkTimeout: null,
            package: 'com.okam.demo',
            name: 'okam-quick',
            versionCode: '1',
            icon: '/common/img/logo.png'
        }
    },

    $store: store,

    globalData: {
        config: {}
    },

    // apis which need promisify
    $promisifyApis: ['getSystemInfo', 'request'],

    $interceptApis: {
        request: {
            async init(options, ctx) {
                console.log('init options', options, ctx);
                let result = await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({abc: 6, s: true});
                    });
                });
                options.data = result;
            },
            done(err, res, ctx) {
                console.log('done...', err, res, ctx);
                if (err) {
                    console.error('request error', err);
                    throw err;
                }

                return res;
            }
        }
    },

    broadcastEvents: {
        broadcastEventC(e) {
            console.log('receive broadcast event c in app...', e, this);
        }
    },

    async testReq() {
        let result = null;
        try {
            result = await this.$http.get('http://www.baidu.com');
            console.log('test asyn test result', result);
        }
        catch (ex) {
            console.error(ex);
        }
        return result;
    },

    async onLaunch() {
        let result = await this.$api.getSystemInfo();
        console.log('launch system info', result);
        console.log('show onLaunch...');

        let reqResult = await this.testReq();
        console.log('request result', reqResult);
    },

    onShow() {
        this.$api.getSystemInfo().then(function (res) {
            console.log('systemInfo', res);
        });

        console.log('show app...');

        // for (let i = 0; i < 5; i++) {
        //     this.$http.get(
        //         'http://www.baidu.com',
        //         {
        //             data: {q: 't' + i},
        //             success(res) {
        //                 console.log('success' + i, res)
        //             }
        //         }
        //     );
        // }
    },

    onHide() {
        console.log('hide app...');
    },

    onError(e) {
        console.error('app error happen', e);
    }
};
