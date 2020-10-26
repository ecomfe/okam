/**
 * @file The config for building h5 app
 * @author sparklewhy@gmail.com
 */

'use strict';

const merge = require('../util').merge;
const baseConf = require('./base');

function isOkamComponentFile(filePath) {
    return filePath.indexOf('okam-component-h5') !== -1;
}

module.exports = merge({}, baseConf, {

    source: {
        noParse: /node_modules\/(vue|vue\-router|vuex)\//,
        noTransform: isOkamComponentFile
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
                'button': 'obutton',
                'block': 'template',
                'view': 'oview',
                'text': 'otext',
                'image': 'oimage',
                'progress': 'oprogress',
                'switch': 'oswitch',
                'slider': 'oslider',
                'input': 'oinput',
                'textarea': 'otextarea',
                'navigator': 'onavigator',
                'checkbox-group': 'ocheckbox-group',
                'checkbox': 'ocheckbox',
                'radio-group': 'oradio-group',
                'radio': 'oradio',
                'icon': 'oicon',
                'scroll-view': 'oscroll-view',
                'swiper': 'oswiper',
                'swiper-item': 'oswiper-item',
                'picker': 'opicker',
                'form': 'oform',
                'rich-text': 'orich-text',
                'video': 'ovideo',
                'web-view': 'oweb-view'
            }
        },
        global: {
            'obutton': 'ocomp/Button',
            'oview': 'ocomp/View',
            'otext': 'ocomp/Text',
            'onavigator': 'ocomp/Navigator',
            'ocheckbox-group': 'ocomp/CheckboxGroup',
            'ocheckbox': 'ocomp/Checkbox',
            'oradio-group': 'ocomp/RadioGroup',
            'oradio': 'ocomp/Radio',
            'oicon': 'ocomp/Icon',
            'oimage': 'ocomp/Image',
            'oprogress': 'ocomp/Progress',
            'oscroll-view': 'ocomp/ScrollView',
            'oswitch': 'ocomp/Switch',
            'oslider': 'ocomp/Slider',
            'oswiper': 'ocomp/Swiper',
            'oswiper-item': 'ocomp/SwiperItem',
            'oinput': 'ocomp/Input',
            'otextarea': 'ocomp/Textarea',
            'opicker': 'ocomp/Picker',
            'oform': 'ocomp/Form',
            'orich-text': 'ocomp/RichText',
            'ovideo': 'ocomp/Video',
            'oweb-view': 'ocomp/WebView'
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
    },

    webpack: {
        loader: {
            vue: {
                transformAssetUrls: {
                    oimage: 'src'
                }
            }
        }
    }
});
