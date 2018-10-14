/**
 * @file Element Transformer
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-properties-quote */
/* eslint-disable fecs-min-vars-per-destructure */

const forIfTransformer = require('./for-if');
const {CONDITION_DIRECTIVES} = require('./constant');

function transformIncludeImportElement(element, tplOpts) {
    let {output: outputOpts} = tplOpts;
    let {attribs: attrs} = element;
    let src = attrs && attrs.src;
    let tplExtname = outputOpts.componentPartExtname.tpl;
    if (src) {
        // change included tpl file path extname to mini program template extname
        attrs.src = src.replace(/\.\w+$/, '.' + tplExtname);
    }
}

function transformTplElement(element) {
    element.name = 'template';
}

module.exports = {
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
