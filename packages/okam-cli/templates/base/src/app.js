/**
 * @file 小程序入口
 * @author ${author|raw}
 */

'use strict';

<% if: ${redux} %>
import store from './store/index';
<% /if %>

export default {
    config: {
        pages: [
            <% if: ${redux} %>
            'pages/counter/index',
            <% /if %>
            'pages/home/index'
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
        },

        /* eslint-disable fecs-camelcase */
        _quickEnv: {
            networkTimeout: null,
            package: 'com.okam.demo',
            name: 'okam-quick',
            versionCode: '2',
            icon: '/common/img/okm.png'
        }
        /* eslint-enable fecs-camelcase */
    },
    <% if: ${redux} %>
    $store: store,
    <% /if %>
    $promisifyApis: [
        <% if: ${async} %>
        'getSystemInfo'
        <% /if %>
    ],

    <% if: ${async} %>
    async onLaunch() {
        let result = await this.$api.getSystemInfo();
        console.log('launch system info', result);
        console.log('show onLaunch...');
    },
    <% /if %>

    onShow() {
        <% if: ${async} %>
        this.$api.getSystemInfo().then(function (res) {
            console.log('systemInfo', res);
        });
        <% /if %>
        console.log('show app...');
    },


    onHide() {
        console.log('hide app...');
    }
};


