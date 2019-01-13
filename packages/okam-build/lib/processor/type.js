/**
 * @file The processor type definition
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const {
    getFileExtnameAssociatedProcessor,
    registerProcessor,
    updateReferProcessorInfo
} = require('./helper/builtin');

function getProcessorPath(type) {
    return path.join(__dirname, type);
}

/**
 * The builtin processors definition
 * key: the processor name
 * value: the processor definition
 *
 * @const
 * @type {Object}
 */
const BUILTIN_PROCESSORS = {

    /**
     * Processor information, `less` is the processor name
     *
     * @type {Object}
     */
    less: {

        /**
         * The processor define path or the processor
         *
         * @type {string|Function}
         */
        processor: getProcessorPath('css/less'),

        /**
         * The npm deps used in this processor,
         * required to install firstly, before using it.
         * Optional.
         *
         * @type {string|Array.<string>}
         */
        deps: 'less',

        /**
         * The extname of the file processed by this processor.
         * Optional.
         *
         * @type {string|Array.<string>}
         */
        extnames: 'less',

        /**
         * The generated file extname after compile.
         * Optional, by default using the original extname.
         *
         * @type {string}
         */
        rext: 'css',

        /**
         * Default processor options
         *
         * @type {Object}
         */
        options: null,

        /**
         * The order of the processor execution order, optional, by default 0.
         * The smaller the order value is, the execution priority of the processor
         * is more higher.
         *
         * Used when the file default processor has more then one.
         * E.g., the stylus style file has default processor `stylus` and `postcss`.
         * The `stylus` processor must be executed before the `postcss` processor,
         * so the `stylus` processor order must be smaller then `postcss` processor.
         *
         * @type {number}
         */
        order: 0,

        /**
         * Processor hook.
         * {
         *     before(file, options) {
         *          // do sth.
         *     }
         * }
         *
         * @type {?Object}
         */
        hook: null
    },
    stylus: {
        processor: getProcessorPath('css/stylus'),
        deps: 'stylus',
        extnames: 'styl',
        rext: 'css'
    },
    sass: {
        processor: getProcessorPath('css/sass'),
        deps: 'node-sass',
        extnames: ['sass', 'scss'],
        rext: 'css'
    },
    postcss: {
        processor: getProcessorPath('css/postcss'),
        deps: 'postcss',
        order: 999
    },
    addCssDependencies: {
        processor: getProcessorPath('css/add-css-dependencies')
    },
    babel: {
        processor: getProcessorPath('js/babel-parser'),
        deps: 'babel-core',
        rext: 'js'
    },
    babel7: {
        processor: getProcessorPath('js/babel7-parser'),
        deps: '@babel/core',
        rext: 'js'
    },
    component: {
        processor: getProcessorPath('component/sfc-parser')
    },
    quickComponentGenerator: {
        processor: getProcessorPath('component/ux-generator')
    },
    quickComponent: {
        processor: getProcessorPath('component/ux-parser'),
        extnames: ['ux']
    },
    json5: {
        processor: getProcessorPath('json/json5-parser'),
        deps: 'json5',
        extnames: 'json5',
        rext: 'json'
    },
    componentJson: {
        processor: getProcessorPath('json/component-json')
    },
    configJson: {
        processor: getProcessorPath('json/config-json')
    },
    quickAppJson: {
        processor: getProcessorPath('json/quick-app-json')
    },
    view: {
        processor: getProcessorPath('template/index'),
        extnames: ['tpl'],
        order: 999
    },
    pug: {
        processor: getProcessorPath('template/pug'),
        extnames: ['pug'],
        deps: 'pug'
    },
    typescript: {
        processor: getProcessorPath('js/typescript-parser'),
        deps: ['@babel/core', '@babel/preset-typescript'],
        extnames: 'ts',
        rext: 'js'
    },
    replacement: {
        processor: getProcessorPath('replacement')
    }
};

exports.BUILTIN_PROCESSORS = BUILTIN_PROCESSORS;

/**
 * The file extname and the processor map:
 * key: file extname,
 * value: the used processor name to process the file that has the specified extname
 *
 * @const
 * @type {Object}
 */
exports.FILE_EXT_PROCESSOR = getFileExtnameAssociatedProcessor(BUILTIN_PROCESSORS);

exports.getProcessorProcessExtname = function (processorName) {
    let result = processorName && BUILTIN_PROCESSORS[processorName];
    let extnames = result && result.extnames;
    if (extnames && Array.isArray(extnames)) {
        return extnames[0];
    }
    return extnames;
};

const STYLE_EXT_NAMES = ['css', 'less', 'styl', 'sass', 'scss'];
exports.STYLE_EXT_NAMES = STYLE_EXT_NAMES;
exports.isStyle = function (extname) {
    return STYLE_EXT_NAMES.includes(extname);
};

const SCRIPT_EXT_NAMES = ['js', 'es', 'es6', 'ts', 'coffee'];
exports.SCRIPT_EXT_NAMES = SCRIPT_EXT_NAMES;
exports.isScript = function (extname) {
    return SCRIPT_EXT_NAMES.includes(extname);
};

const IMG_EXT_NAMES = ['png', 'gif', 'jpeg', 'jpg', 'webp', 'svg'];
exports.IMG_EXT_NAMES = IMG_EXT_NAMES;
exports.isImg = function (extname) {
    return IMG_EXT_NAMES.includes(extname);
};

const TEMPLATE_EXT_NAMES = ['html', 'tpl', 'etpl', 'art', 'jade', 'pug'];
exports.TEMPLATE_EXT_NAMES = TEMPLATE_EXT_NAMES;
exports.isTemplate = function (extname) {
    return TEMPLATE_EXT_NAMES.includes(extname);
};

const JSON_EXT_NAMES = ['json', 'json5'];
exports.JSON_EXT_NAMES = JSON_EXT_NAMES;
exports.isJSON = function (extname) {
    return JSON_EXT_NAMES.includes(extname);
};

exports.registerProcessor = registerProcessor.bind(
    null, BUILTIN_PROCESSORS, exports.FILE_EXT_PROCESSOR
);

exports.updateReferProcessorInfo = updateReferProcessorInfo.bind(
    null, BUILTIN_PROCESSORS
);
