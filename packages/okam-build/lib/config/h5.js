/**
 * @file The config for building h5 app
 * @author sparklewhy@gmail.com
 */

'use strict';

const merge = require('../util').merge;
const baseConf = require('./base');

function isOkamComponentFile(file) {
    return file.path.indexOf('okam-component-h5') !== -1;
}

module.exports = merge({}, baseConf, {

    source: {
        noParse: /\/vue|vue\-router|vuex\//
    },

    output: {

        /**
         * 输出的文件路径映射定义
         *
         * @type {Object}
         */
        pathMap: {
            projectConfig: false,
            entryScript: 'main.js',
            entryStyle: 'main.css',
            appConfig: false
        },

        /**
         * 自定义输出文件路径。
         * 如果该文件不输出，返回 `false`。
         *
         * @param {string} path 要输出的文件相对路径
         * @param {Object} file 要输出的文件对象
         * @return {boolean|string}
         */
        file(path, file) {
            if (file.isStyle && file.extname !== 'css' && !file.compiled) {
                return false;
            }

            // do not output not processed file and component config file
            if (!file.allowRelease) {
                return false;
            }

            return path;
        },

        /**
         * None app base class is needed
         */
        appBaseClass: null
    },

    api: {
        defaultH5Api: {
            modId: 'okam-api-h5',
            override: true
        }
    },

    component: {
        template: {
            transformTags: {
                'button': 'o-button'
            }
        },
        global: {
            'o-button': 'ocomp/Button'
        }
    },

    processors: {
        // okam component parser
        component: {
            rext: 'vue',
            options: {
                parse: {pad: 'space'},
                trim: true
            }
        },

        postcss: {
            extnames: ['css']
        },

        view: {
            hook: {
                before(file, options) {
                    if (isOkamComponentFile(file)) {
                        options.ignoreDefaultOptions = true;
                        options.keepOriginalContent = true;
                        options.plugins = ['resource'];
                    }
                }
            }
        }
    },

    rules: [
        {
            match(file) {
                return file.isComponent;
            },
            processors: ['vueComponentGenerator']
        }
    ],

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.runtime.esm.js',
            'ocomp/': 'okam-component-h5/src/'
        }
    }
});
