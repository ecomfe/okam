/**
 * @file Build quick app build config
 * @author ${author|raw}
 */

'use strict';

const path = require('path');
const merge = require('okam-build').merge;


/**
 * 不 merge 属性选择器，即直接覆盖属性值
 *
 * @type {Array.<string>}
 */
const overridePropertySelectors = [
    'processors.postcss',
    'component.template'
];

const OUTPUT_DIR = 'quick_dist';
module.exports = merge({}, require('./base.config'), {
    output: {
        dir: OUTPUT_DIR,
        depDir: 'src/common'
    },
    <% if: ${async} %>
    polyfill: [
        'async'
    ],
    <% /if %>
    framework: [],

    component: {
        template: {
            transformTags: {
                'view': 'div',
                'button': 'my-button'
            }
        },
        global: {
            'my-button': './components/quick/Button'
        }
    },

    api: {
        // audio: '@system.audio'
    },

    processors: {
        postcss: {
            extnames: ['styl'],
            options: {
                plugins: ['env', 'quickcss']
            }
        }
    },

    script: {
        onBuildStart: {
            cmd: 'node init-quick-app.js',
            options: {
                cwd: __dirname
            }
        },
        onBuildDone(opts) {
            let cmd = (opts && opts.watch) ? 'watch' : 'build';
            let options = {
                cwd: path.join(__dirname, '..', OUTPUT_DIR)
            };
            return [
                {cmd: 'npm run ' + cmd, options},
                {cmd: 'npm run server -- --port 8090', options}
            ];
        }
    }
}, overridePropertySelectors);
