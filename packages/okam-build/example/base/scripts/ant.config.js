/**
 * @file Build wx mini program config
 * @author xxx
 */

'use strict';

const merge = require('../../../').merge;

module.exports = merge({}, require('./base.config'), {
    output: {
        dir: 'ant_dist'
    },
    localPolyfill: [
        'async'
        // 'promise'
    ],

    framework: ['filter'],
    component: {
        template: {
            modelMap: {
                'sp-model-component': {
                    eventType: 'spchange',
                    eventName: 'onSpchange',
                    attrName: 'spvalue',
                    detailName: 'value'
                }
            }
        }
    },
    processors: {
        babel7: {
            extnames: 'js',
            // options: {
            //     presets: ['@babel/preset-env']
            // }
        }
    },

    dev: {
        // processors: {
        //     postcss: {
        //         options: {
        //             plugins: {
        //                 'postcss-url': {
        //                     url: 'inline'
        //                 }
        //             }
        //         }
        //     }
        // }
    }
});
