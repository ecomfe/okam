/**
 * @file swan-model-plugin
 * @author xiaohong8023@outlook.com
 */

'use strict';

const {createSyntaxPlugin} = require('../helper');
const {modelTransformer} = require('./model-helper');

const MODEL_MAP = {
     // 自定义默认的规则
    '__default': {
        eventType: 'change',
        eventName: 'bindchange',
        attrName: 'value'
    },
    'input': {
        eventType: 'input',
        eventName: 'bindinput',
        attrName: 'value'
    },
    'textarea': {
        eventType: 'input',
        eventName: 'bindinput',
        attrName: 'value'
    },
    'picker': {
        eventType: 'change',
        eventName: 'bindchange',
        attrName: 'value'
    },
    'switch': {
        eventType: 'change',
        eventName: 'bindchange',
        attrName: 'checked',
        detailName: 'checked'
    },
    'checkbox-group': {
        eventType: 'change',
        eventName: 'bindchange'
        // 没有 attrName
    },
    'radio-group': {
        eventType: 'change',
        eventName: 'bindchange'
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
