/**
 * @file transform condition syntax
 * @author sharonzd
 */

'use strict';

/**
 * Transform condition syntax, e.g, if/if-else/else
 *
 * @param {Object} attrs the attrs of the element
 * @param {string} name the data binding attribute name
 * @param {Object} tplOpts the template transform options
 * @param {Object=} opts the transformation plugin options
 * @param {boolean=} opts.wrapCondition whether wrap the condition attribute value
 *        using variable syntax, e.g., if='a>3' => if="{{a>3}}",
 *        if wrapVariable is true
 * @param {Object} opts.syntaxMap the okam condition syntax map that map to the
 *        specified app type condition syntax
 */
module.exports = function (attrs, name, tplOpts, opts) {
    const {logger, file} = tplOpts;
    const {syntaxMap, wrapCondition = false} = opts;
    const newName = syntaxMap[name] || name;

    if (newName !== name && attrs.hasOwnProperty(newName)) {
        logger.warn(`${file.path} template attribute ${name} is conflicted with ${newName}`);
    }

    let value = attrs[name];
    if (wrapCondition && typeof value === 'string') {
        value = `{{${value}}}`;
    }
    attrs[newName] = value;

    if (newName !== name) {
        delete attrs[name];
    }
};
