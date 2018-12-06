/**
 * @file Build wx mini program config
 * @author xxx
 */

'use strict';

const path = require('path');

module.exports = {
    verbose: false,
    root: path.join(__dirname, '..'),
    output: {
        dir: 'wx_dist',
        depDir: 'src/common'
    },
    component: {
        extname: 'vue'
    },
    framework: [
        'data',
        'watch',
        'broadcast',
        'ref'
    ],
};
