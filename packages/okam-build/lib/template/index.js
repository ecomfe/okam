/**
 * @file Template parser entry
 * @author sparklewhy@gmail.com
 */

'use strict';

const {parse, ELEMENT_TYPE} = require('./parser');
const serialize = require('./serializer/dom-serializer');

module.exports = {
    parse,
    ELEMENT_TYPE,
    serialize
};
