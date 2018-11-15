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
        }
    },
    <% if: ${redux} %>
    $store: store,
    <% /if %>
    $promisifyApis: []
};


