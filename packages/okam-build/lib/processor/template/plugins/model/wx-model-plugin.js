/**
 * @file wx-model-plugin
 * @author xiaohong8023@outlook.com
 */

'use strict';

const {createSyntaxPlugin} = require('../helper');
const {modelTransformer} = require('./model-helper');

const DEFAULT_MODEL_MAP = {
     // 自定义默认的规则
    'default': {
        eventType: 'change',
        attrName: 'value'
    },
    'input': {
        eventType: 'input',
        attrName: 'value',
        detailName: 'value'
    },
    'textarea': {
        eventType: 'input',
        attrName: 'value',
        detailName: 'value'
    },
    'picker': {
        eventType: 'change',
        attrName: 'value',
        detailName: 'value'
    },
    'switch': {
        eventType: 'change',
        attrName: 'checked',
        detailName: 'value'
    },
    'checkbox-group': {
        eventType: 'change',
        detailName: 'value'
        // 没有 attrName
    },
    'radio-group': {
        eventType: 'change',
        detailName: 'value'
        // 没有 attrName
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
