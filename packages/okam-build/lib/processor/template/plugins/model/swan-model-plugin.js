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
        eventType: 'change',
        eventName: 'bindchange',
        attrName: 'value',
        detailName: 'value'
    },
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
        detailName: 'value'
        // 没有 attrName
    },
    'radio-group': {
        eventType: 'change',
        eventName: 'bindchange',
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
