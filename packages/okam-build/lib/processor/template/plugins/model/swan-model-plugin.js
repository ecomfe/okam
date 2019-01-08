/**
 * @file swan-model-plugin
 * @author xiaohong8023@outlook.com
 */

'use strict';

const {createSyntaxPlugin} = require('../helper');
const {modelTransformer} = require('./model-helper');

const MODEL_MAP = {
    'input': {
        eventType: 'input',
        eventName: 'bindinput',
        attrName: 'value',
        detailName: 'value'
    },
    'textarea': {
        eventType: 'input',
        eventName: 'bindinput',
        attrName: 'value',
        detailName: 'value'
    },
    'picker': {
        eventType: 'change',
        eventName: 'bindchange',
        attrName: 'value',
        detailName: 'value'
    },
    'switch': {
        eventType: 'change',
        eventName: 'bindchange',
        attrName: 'checked',
        detailName: 'checked'
    },
    'checkbox-group': {
        eventType: 'change',
        eventName: 'bindchange',
        // 没有 attrName
        detailName: 'value'
    },
    'radio-group': {
        eventType: 'change',
        eventName: 'bindchange',
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
