/**
 * @file The app entrance
 * @author xxx@baidu.com
 */

'use strict';

export default {
    config: {
        pages: [
            'pages/componentPage'
        ],
        window: {
            navigationBarTitleText: 'Demo'
        }
    },

    // apis which need promisify
    // $promisifyApis: [],

    $interceptApis: {}
};
