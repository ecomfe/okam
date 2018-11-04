/**
 * @file Build swan smart program config
 * @author xxx
 */

'use strict';

const path = require('path');


module.exports = {
    verbose: false,
    root: path.join(__dirname, '..'),
    output: {
        dir: 'dist',
        depDir: 'src/common'
    },
    wx2swan: true,
    component: {
        extname: 'vue'
    },
    framework: [],
    polyfill: []
};
