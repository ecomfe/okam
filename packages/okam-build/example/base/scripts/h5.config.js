/**
 * @file Build h5 app build config
 * @author <author>
 */

'use strict';

const path = require('path');
const {defaultMiniProgramTagToH5, merge} = require('../../../');

const OUTPUT_DIR = 'h5_dist';

/**
 * 不 merge 属性选择器，即直接覆盖属性值
 *
 * @type {Array.<string>}
 */
const overridePropertySelectors = [
    'component.template',
    'processors.postcss.options.plugins'
];

module.exports = merge({}, require('./base.config'), {
    output: {
        dir: OUTPUT_DIR,
        depDir: {
            node_modules: 'src/npm',
            dep: 'src/npm'
        }
    },

    polyfill: ['async'],

    framework: ['filter'],

    component: {
        template: {
            useVuePrefix: true,
            transformTags: defaultMiniProgramTagToH5
        }
    },

    processors: {
        postcss: {
            extnames: ['css', 'styl', 'less'],
            options: {
                plugins: [
                    [
                        'autoprefixer',
                        {
                            browsers: [
                                '> 1%',
                                'last 2 versions',
                                'not ie <= 8'
                            ]
                        }
                    ],
                    'postcss-url',
                    'postcss-import-sync2',
                    'env'
                ]
            }
        }
    },

    script: {
        onBuildDone(opts) {
            let cmd = 'build'; // (opts && opts.watch) ? 'watch' : 'build';
            let options = {
                cwd: path.join(__dirname, '..', OUTPUT_DIR)
            };
            return [
                {cmd: `npm run ${cmd}`, options}
            ];
        }
    }
}, overridePropertySelectors);
