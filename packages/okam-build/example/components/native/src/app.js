/**
 * @file The app entrance
 * @author xxx@baidu.com
 */

'use strict';

export default {
    config: {
        pages: [
            // index
            'pages/index',
            // 组件是微信原生组件
            'pages/wxWxs',
            // swan native
            'pages/swanNative/index',
            // wx native
            'pages/wxNative/index',
            // filter
            'pages/swanFilter'
        ],
        window: {
        }
    }
};
