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
    component: {
        extname: 'vue'
    },
    framework: [],
    polyfill: [],
    native: true // 如果不需要启用原生转换，可以设为 false，默认为 true
};
