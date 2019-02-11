/**
 * @file Build mini program base config
 * @author xxx
 */

'use strict';

/* eslint-disable fecs-properties-quote */
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
    framework: [
        'data',
        // 'watch',
        // 'model',
        // ['behavior', '{useNativeBehavior: true}'],
        // 'broadcast',
        // 'redux',
        'ref'
    ],
    polyfill: [],
    processors: {
        babel7: {
            extnames: 'js'
        }
    }
};
