/**
 * @file Dom serializer. This serializer is modified based on https://github.com/cheeriojs/dom-serializer
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const {ElementType} = require('htmlparser2');
const entities = require('entities');
const {toObjectMap} = require('../../../util');

// const booleanAttributes = toObjectMap(require('./bool-attributes'));
const unencodedElements = toObjectMap(require('./unencoded-tags'));
const singleTag = toObjectMap(require('./selfclose-tags'));

/**
 * Serialize tag attributes info
 *
 * @inner
 * @param {Object} attributes tag attributes info
 * @param {Object} opts the serialize options
 * @return {string}
 */
function serializeAttrs(attributes, opts) {
    if (!attributes) {
        return;
    }

    let output = '';
    let value;
    Object.keys(attributes).forEach(key => {
        value = attributes[key];
        if (output) {
            output += ' ';
        }

        let isBoolAttr = value && typeof value === 'boolean';
        if (isBoolAttr) {
            output += key;
        }
        else {
            output += key + '="' + (opts.decodeEntities ? entities.encodeXML(value) : value) + '"';
        }
    });

    return output;
}

/**
 * Serialize directive
 *
 * @inner
 * @param {Object} elem the directive to serialize
 * @return {string}
 */
function serializeDirective(elem) {
    return '<' + elem.data + '>';
}

/**
 * Serialize CDATA
 *
 * @inner
 * @param {Object} elem the CDATA to serialize
 * @return {string}
 */
function serializeCDATA(elem) {
    return '<![CDATA[' + elem.children[0].data + ']]>';
}

/**
 * Serialize comment
 *
 * @inner
 * @param {Object} elem the comment to serialize
 * @return {string}
 */
function serializeComment(elem) {
    return '<!--' + elem.data + '-->';
}

/**
 * Serialize text
 *
 * @inner
 * @param {Object} elem the text to serialize
 * @param {Object} opts the serialize options
 * @return {string}
 */
function serializeText(elem, opts) {
    let data = elem.data || '';

    // if entities weren't decoded, no need to encode them back
    if (opts.decodeEntities && !(elem.parent && unencodedElements[elem.parent.name])) {
        data = entities.encodeXML(data);
    }

    return data;
}

/**
 * Serialize tag
 *
 * @inner
 * @param {Object} elem the tag to serialize
 * @param {Object} opts the serialize options
 * @return {string}
 */
function serializeTag(elem, opts) {
    // Handle SVG
    if (elem.name === 'svg') {
        opts = {decodeEntities: opts.decodeEntities, xmlMode: true};
    }

    let tag = '<' + elem.name;
    let attribs = serializeAttrs(elem.attribs, opts);

    if (attribs) {
        tag += ' ' + attribs;
    }

    let closeAllTag = opts.xmlMode;
    let isSingleTag = singleTag[elem.name];
    let hasChildren = elem.children && elem.children.length;
    let endTag = '</' + elem.name + '>';
    if (hasChildren) {
        tag += '>';
        tag += serializeDom(elem.children, opts);
        tag += endTag;
    }
    else if (closeAllTag || !isSingleTag) {
        if (isSingleTag || elem.isSelfClose) {
            tag += '/>';
        }
        else {
            tag += '>' + endTag;
        }
    }
    else {
        tag += '>';
    }

    return tag;
}

/**
 * Serialize dom
 *
 * @param {Object|Array} dom the dom to serialize
 * @param {Object} opts the serialize options
 * @param {boolean=} opts.xmlMode whether serialize using xml mode, optional, by defaul false
 * @param {boolean=} opts.decodeEntities whether the given dom entities are decoded, optional, by default false
 * @return {string}
 */
function serializeDom(dom, opts) {
    if (!Array.isArray(dom)) {
        dom = [dom];
    }

    opts = opts || {};

    let output = '';
    for (let i = 0, len = dom.length; i < len; i++) {
        let elem = dom[i];

        if (elem.type === 'root') {
            output += serializeDom(elem.children, opts);
        }
        else if (ElementType.isTag(elem)) {
            output += serializeTag(elem, opts);
        }
        else if (elem.type === ElementType.Directive) {
            output += serializeDirective(elem);
        }
        else if (elem.type === ElementType.Comment) {
            output += serializeComment(elem);
        }
        else if (elem.type === ElementType.CDATA) {
            output += serializeCDATA(elem);
        }
        else {
            output += serializeText(elem, opts);
        }
    }

    return output;
}

module.exports = exports = serializeDom;
