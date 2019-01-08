/**
 * @file ant-model-plugin
 * @author xiaohong8023@outlook.com
 */

'use strict';

const {createSyntaxPlugin} = require('../helper');
const {modelTransformer} = require('./model-helper');

const MODEL_MAP = {
    'input': {
        eventType: 'input',
        eventName: 'onInput',
        attrName: 'value',
        detailName: 'value'
    },
    'textarea': {
        eventType: 'input',
        eventName: 'onInput',
        attrName: 'value',
        detailName: 'value'
    },
    'picker': {
        eventType: 'change',
        eventName: 'onChange',
        attrName: 'value',
        detailName: 'value'
    },
    'switch': {
        eventType: 'change',
        eventName: 'onChange',
        attrName: 'checked',
        detailName: 'value'
    },
    'checkbox-group': {
        eventType: 'change',
        eventName: 'onChange',
        // 没有 attrName
        detailName: 'value'
    },
    'radio-group': {
        eventType: 'change',
        eventName: 'onChange',
        // 没有 attrName
        detailName: 'value'
    }
};

module.exports = createSyntaxPlugin({
    attribute: {
        model: {
            match: 'model',
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
