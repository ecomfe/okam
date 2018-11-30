/**
 * @file Template parser
 * @author sparklewhy@gmail.com
 */

'use strict';

const util = require('util');
const {DomHandler, Parser, ElementType} = require('htmlparser2');

const DEFAULT_OPTIONS = {
    lowerCaseTags: true,
    recognizeSelfClosing: true,
    lowerCaseAttributeNames: false
};

const rawOnattribend = Parser.prototype.onattribend;
const rawOnattribdata = Parser.prototype.onattribdata;
const rawOnselfclosingtag = Parser.prototype.onselfclosingtag;

class TemplateParser {
    constructor(...args) {
        Parser.apply(this, args);
    }

    onattribdata(...args) {
        rawOnattribdata.apply(this, args);
        this._hasAttrValue = true;
    }

    onattribend(...args) {
        if (!this._hasAttrValue) {
            // reset boolean value
            this._attribvalue = true;
        }

        rawOnattribend.apply(this, args);
        this._hasAttrValue = false;
    }

    onselfclosingtag(...args) {
        this._isSelfClosingTag = true;
        rawOnselfclosingtag.apply(this, args);
    }
}

util.inherits(TemplateParser, Parser);

function onElement(element) {
    element.isSelfClose = this.parser._isSelfClosingTag;
    this.parser._isSelfClosingTag = false;
}

function parseDom(data, options) {
    // 默认按非 xmlMode 解析文档，这样就可以允许 HTML 自闭合空元素不用闭合，e.g. <input>
    options || (options = DEFAULT_OPTIONS);

    let handler = new DomHandler(options, onElement);
    let parser = new TemplateParser(handler, options);
    handler.parser = parser;

    parser.end(data);
    handler.parser = null;

    let children = handler.dom;
    let rootNode = {
        type: 'root',
        children
    };
    children.forEach(item => (item.parent = rootNode));
    return rootNode;
}

module.exports = exports = {
    parse: parseDom,
    ELEMENT_TYPE: ElementType
};
