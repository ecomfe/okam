/**
 * @file Element Transformer
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-properties-quote */
/* eslint-disable fecs-min-vars-per-destructure */

const {replaceExtname} = require('../../../../util').file;
const forIfTransformer = require('./for-if');
const transformTplElement = require('./tpl');
const transformEnvElement = require('./env');
const {CONDITION_DIRECTIVES, ENV_ELEMENT_REGEXP} = require('./constant');

function transformIncludeImportElement(element, tplOpts) {
    let {output: outputOpts} = tplOpts;
    let {attribs: attrs} = element;
    let src = attrs && attrs.src;
    let tplExtname = outputOpts.componentPartExtname.tpl;
    if (src) {
        // change included tpl file path extname to mini program template extname
        attrs.src = replaceExtname(src, tplExtname);
    }
}

module.exports = {
    env: {
        match(element) {
            return ENV_ELEMENT_REGEXP.test(element.name);
        },
        transform: transformEnvElement
    },
    import: {
        match: 'import',
        transform: transformIncludeImportElement
    },
    include: {
        match: 'include',
        transform: transformIncludeImportElement
    },
    tpl: {
        match: 'tpl',
        transform: transformTplElement
    },
    forIf: {
        match(element) {
            let attrs = element.attribs;
            // for 和 if/else-if/elif/else 共存
            return attrs && attrs.for && CONDITION_DIRECTIVES.some(item => attrs[item]);
        },
        transform: forIfTransformer
    }
};
