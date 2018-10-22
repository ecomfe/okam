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
    processors: {
        babel: {
            extnames: ['js']
        },
        wx2swan: {
            extnames: ['wxml', 'wxss']
        }
    },
    rules: [
        {
            match(file) {
                return file.isWxCompScript;
            },
            processors: ['wx2swan']
        }
    ]
};
