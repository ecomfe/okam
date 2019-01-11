/**
 * @file swan-model-plugin
 * @author xiaohong8023@outlook.com
 */

'use strict';

const {createSyntaxPlugin} = require('../helper');
const {modelTransformer} = require('./model-helper');


/**
 * 内置 model 规则
 *
 * @type {Object}
 * @const
 */
const DEFAULT_MODEL_MAP = {
    // 自定义默认的规则
    'default': {
        event: 'change',
        prop: 'value'
    },
    'input': {
        event: 'input',
        prop: 'value',
        detailProp: 'value'
    },
    'textarea': {
        event: 'input',
        prop: 'value',
        detailProp: 'value'
    },
    'picker': {
        event: 'change',
        prop: 'value',
        detailProp: 'value'
    },
    'switch': {
        event: 'change',
        prop: 'checked',
        detailProp: 'checked'
    },
    'checkbox-group': {
        event: 'change',
        detailProp: 'value'
        // 没有 prop
    },
    'radio-group': {
        event: 'change',
        detailProp: 'value'
        // 没有 prop
    }
};

module.exports = createSyntaxPlugin({
    attribute: {
        model: {
            match: 'v-model',
            transform(attrs, name, tplOpts, opts = {}, element) {
                opts.modelMap = Object.assign(
                    {},
                    DEFAULT_MODEL_MAP,
                    opts.modelMap || {}
                );

                modelTransformer(
                    attrs,
                    name,
                    tplOpts,
                    opts,
                    element
                );
            }
        }
    }
});
