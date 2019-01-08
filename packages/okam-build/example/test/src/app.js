/**
 * @file 小程序入口
 * @author xxx
 */

'use strict';


export default {
    config: {
        pages: [
            'pages/home/index',
            'pages/sfc/sfc',
            'pages/home/styl'
        ],

        window: {
            navigationBarBackgroundColor: '#211E2E',
            navigationBarTextStyle: 'white',
            backgroundTextStyle: 'light',
            enablePullDownRefresh: true,
            backgroundColor: '#ccc'
        },

        networkTimeout: {
            request: 30000
        }
    },
    $promisifyApis: [
        'getSystemInfo'
    ],

    async onLaunch() {
        let result = await this.$api.getSystemInfo();
        console.log('launch system info', result);
        console.log('show onLaunch...');
    },

    onShow() {
        this.$api.getSystemInfo().then(function (res) {
            console.log('systemInfo', res);
        });
        console.log('show app...');
    },


    onHide() {
        console.log('hide app...');
    }
};


