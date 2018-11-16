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
        dir: 'ant_dist',
        depDir: 'src/common'
    },
    component: {
        extname: 'vue'
    },
    framework: [
        'data',
        'watch'
    ],
    processors: {
        babel7: {
            extnames: 'js',
            options: {
                presets: ['@babel/preset-env']
            }
        }
    }
};
