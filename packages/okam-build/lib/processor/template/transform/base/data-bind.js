/**
 * @file transform data binding
 * @author sparklewhy@gmail.com
 * @author sharonzd
 */

'use strict';

const {PLAIN_OBJECT_REGEXP, DATA_BIND_REGEXP} = require('./constant');
const {transformFilterSyntaxValue} = require('./filter');

/**
 * Transform data binding syntax
 *
 * @param {Object} attrs the attrs of the element
 * @param {string} name the data binding attribute name
 * @param {Object} tplOpts the template transform options
 * @param {Object=} opts the transformation plugin options
 * @param {boolean=} opts.tripleBrace whether wrap the object data using triple
 *        brace, e.g., :obj='{a: 3}' => obj="{{{a: 3}}}", if tripleBrace is true
 * @param {Object} element the node to process
 */
module.exports = function (attrs, name, tplOpts, opts, element) {
    let {logger, file, config} = tplOpts;
    let tripleBrace = opts && opts.tripleBrace;
    let newName = name.replace(DATA_BIND_REGEXP, '');
    let value = attrs[name];
    if (typeof value === 'string') {
        value = value.trim();

        if (PLAIN_OBJECT_REGEXP.test(value)) {
            if (tripleBrace) {
                value = `{{ ${value} }}`;
            }
            else {
                value = `{${value}}`;
            }
        }
        else {
            let newValue = transformFilterSyntaxValue(
                element, {name: newName, value}, config, logger
            );
            value = `{{${newValue}}}`;
        }
    }

    if (attrs.hasOwnProperty(newName)) {
        logger.warn(`${file.path} template attribute ${name} is conflicted with ${newName}`);
    }

    delete attrs[name];
    attrs[newName] = value;
};
