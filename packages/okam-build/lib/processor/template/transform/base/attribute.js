/**
 * @file Element attribute transformer
 * @author sparklewhy@gmail.com
 */

'use strict';

const classTransformer = require('./class');
const styleTransformer = require('./style');
const dataBindTransformer = require('./data-bind');

const {DATA_BIND_REGEXP, CONDITION_DIRECTIVES} = require('./constant');

/* eslint-disable fecs-properties-quote */
/**
 * 顺序要求：
:class, :style, :key在 :data-binding之前，避免:class,:style,:key被重复处理
 for在 :key 之前，因为 :key 要用到 for 生成的值
 */
module.exports = {
    class: {
        match: ':class',
        transform: classTransformer
    },
    style: {
        match: ':style',
        transform: styleTransformer
    },
    for: {
        match: 'for',
        transform: null
    },
    key: {
        match: ':key',
        transform: null
    },
    bind: {
        match: DATA_BIND_REGEXP,
        transform: dataBindTransformer
    },
    if: {
        match(name) {
            return CONDITION_DIRECTIVES.includes(name);
        },
        transform: null
    }
};
