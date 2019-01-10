/**
 * @file ant-model-plugin
 * @author xiaohong8023@outlook.com
 */

'use strict';

const {createSyntaxPlugin} = require('../helper');
const {modelTransformer} = require('./model-helper');

const MODEL_MAP = {
    // 自定义默认的规则
    '__default': {
        eventType: 'change',
        eventName: 'onChange',
        attrName: 'value'
    },
    'input': {
        eventType: 'input',
        eventName: 'onInput',
        attrName: 'value'
    },
    'textarea': {
        eventType: 'input',
        eventName: 'onInput',
        attrName: 'value'
    },
    'picker': {
        eventType: 'change',
        eventName: 'onChange',
        attrName: 'value'
    },
    'switch': {
        eventType: 'change',
        eventName: 'onChange',
        attrName: 'checked'
    },
    'checkbox-group': {
        eventType: 'change',
        eventName: 'onChange'
        // 没有 attrName
    },
    'radio-group': {
        eventType: 'change',
        eventName: 'onChange'
        // 没有 attrName
    }
};



module.exports = createSyntaxPlugin({
    attribute: {
        model: {
            match: 'v-model',
            transform(attrs, name, tplOpts, opts, element) {
                modelTransformer(
                    MODEL_MAP,
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
