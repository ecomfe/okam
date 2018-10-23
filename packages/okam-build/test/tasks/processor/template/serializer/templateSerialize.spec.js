/**
 * @file Template serialize test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */

const assert = require('assert');
const {
    parse: parseDom,
    ELEMENT_TYPE
} = require('okam/processor/template/parser');
const serializeDom = require('okam/processor/template/serializer');
const {readFile} = require('../../../helper');

function readTpl(file, isExpect) {
    return readFile(
        `templateSerialize/${file}`
        + (isExpect ? '.expect' : '')
        + '.tpl'
    );
}

describe('template parse and serialize tool', function () {
    it('should export parse, elementType, serialize api', function () {
        assert(typeof parseDom === 'function');
        assert(ELEMENT_TYPE && typeof ELEMENT_TYPE === 'object');
        assert(typeof serializeDom === 'function');
    });

    it('should autoclose tag', function () {
        let content = readTpl('autoClose');
        let ast = parseDom(content);
        content = serializeDom(ast, {xmlMode: true});
        assert(content === readTpl('autoClose', true));
    });

    it('should remove end tag when encouter void element', function () {
        let content = readTpl('removeVoidEndTag');
        let ast = parseDom(content);
        content = serializeDom(ast, {xmlMode: true});
        assert(content === readTpl('removeVoidEndTag', true));
    });

    it('should keep boolean attributes', function () {
        let content = readTpl('boolAttribute');
        let ast = parseDom(content);
        content = serializeDom(ast, {xmlMode: true});
        assert(content === readTpl('boolAttribute', true));
    });
});
