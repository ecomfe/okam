/**
 * @file Build h5 app build config
 * @author <author>
 */

'use strict';

const path = require('path');
const merge = require('../../../').merge;

const OUTPUT_DIR = 'h5_dist';

/**
 * 不 merge 属性选择器，即直接覆盖属性值
 *
 * @type {Array.<string>}
 */
const overridePropertySelectors = [
    'framework',
    'component.template',
    'processors.postcss.options.plugins'
];

module.exports = merge({}, require('./base.config'), {
    output: {
        dir: OUTPUT_DIR,
        depDir: false
    },

    polyfill: ['async'],

    framework: [],

    component: {
        template: {
            transformTags: {
                'view': 'div'
            }
        }
    },

    processors: {
        postcss: {
            extnames: ['css', 'styl', 'less'],
            options: {
                plugins: ['autoprefixer', 'env']
            }
        }
    }
}, overridePropertySelectors);
