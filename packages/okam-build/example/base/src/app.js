/**
 * @file The app entrance
 * @author xxx@baidu.com
 */

'use strict';

import store from './store/index';
// import a from 'a';
import './app.styl';

if (process.env.APP_TYPE === 'h5') {
    // require('normalize.css');
    require('okam-component-h5/src/index.css');
}

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
            'pages/sfc/separate',
            'pages/api/index',
            'pages/api/navTitle',
            'pages/api/network',
            'pages/api/window',
            'pages/api/interaction',
            'pages/api/location',
            'pages/api/payment',
            'pages/api/animation',
            'pages/api/image',
            'pages/api/websocket',
            'pages/api/scroll',
            'pages/api/tab',
            'pages/api/navigator',
            'pages/api/clipboard',
            'pages/api/storage',
            'pages/api/system',
            'pages/api/phone',
            'pages/components/index',
            'pages/components/text',
            'pages/components/checkbox',
            'pages/components/icon',
            'pages/components/radio',
            'pages/components/image',
            'pages/components/progress',
            'pages/components/scrollview',
            'pages/components/switch',
            'pages/components/slider',
            'pages/components/swiper',
            'pages/components/input',
            'pages/components/textarea',
            'pages/components/picker',
            'pages/components/form',
            'pages/components/richText',
            'pages/components/video'
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
        tabBar: {
            color: '#2196F3',
            selectedColor: '#f44336',
            backgroundColor: '#ccc',
            // borderStyle: 'white', // 'black',
            // position: 'top', // 'bottom',
            list: [
                {
                    pagePath: 'pages/home/index',
                    text: '首页',
                    iconPath: 'common/img/data.png',
                    selectedIconPath: 'common/img/ui.png'
                },
                {
                    pagePath: 'pages/api/index',
                    text: 'API',
                    iconPath: 'common/img/api.png',
                    selectedIconPath: 'common/img/ui.png'
                },
                {
                    pagePath: 'pages/components/index',
                    text: '组件',
                    iconPath: 'common/img/component.png',
                    selectedIconPath: 'common/img/ui.png'
                },
                {
                    pagePath: 'pages/api/tab',
                    text: 'TabBar',
                    iconPath: 'common/img/data.png',
                    selectedIconPath: 'common/img/ui.png'
                }
            ]
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
