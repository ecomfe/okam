/**
 * @file Mini program view template syntax transform plugin helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */

/**
 * Find the matched transformer
 *
 * @inner
 * @param {Array} transformers the transformers
 * @param {string} value the element name or attribute name or text node data to match
 * @param {string|Object} matchItem the element or attribute name or text node item to match
 * @return {?Object}
 */
function findMatchTransformer(transformers, value, matchItem) {
    if (!value) {
        return;
    }

    let found;
    transformers.some(item => {
        let match = item.match;
        let isMatch = false;
        let type = typeof match;
        if (type === 'string') {
            isMatch = match === value;
        }
        else if (type === 'function') {
            isMatch = match(matchItem);
        }
        else {
            // default RegExp
            isMatch = match.test('' + value);
        }

        if (isMatch) {
            found = item.transform;
        }
        return isMatch;
    });

    return found;
}

/**
 * Find the matched element attribute transformer
 *
 * @inner
 * @param {Array} attrTransformers the attribute transformers
 * @param {string} attrName the element attribute name
 * @return {?Object}
 */
function findMatchAttrTransformer(attrTransformers, attrName) {
    return findMatchTransformer(attrTransformers, attrName, attrName);
}

/**
 * Find the matched element transformer
 *
 * @inner
 * @param {Array} elemTransformers the element transformers
 * @param {Object} element the element to be processed
 * @return {?Object}
 */
function findMatchElemTransformer(elemTransformers, element) {
    return findMatchTransformer(elemTransformers, element.name, element);
}

/**
 * Normalize the transformers
 *
 * @param {Object} transformerMap the transform map
 * @return {Array}
 */
function normalizeTransformers(transformerMap) {
    let result = [];
    transformerMap && Object.keys(transformerMap).forEach(k => {
        let item = transformerMap[k];
        if (item) {
            item.transform.type = k;
            result.push(
                Object.assign({}, item, {name: k})
            );
        }
    });
    return result;
}

/**
 * Transform the given template element
 *
 * @param {Object} transformers the custom transformers
 * @param {Object} element the element to be visited currently
 * @param {Object} tplOpts the template transform options
 * @param {Object} options the template transform plugin options
 */
function transform(transformers, element, tplOpts, options) {
    let {config} = tplOpts;
    let onTag = config.onTag;
    if (onTag) {
        onTag(element.name);
    }

    // transform element first
    let transformer = findMatchElemTransformer(transformers.element, element);
    transformer && transformer.call(this, element, tplOpts, options);

    if (element.removed) {
        return;
    }

    // transform element attributes
    let {attribs: attrs} = element;
    attrs && Object.keys(attrs).forEach(k => {
        transformer = findMatchAttrTransformer(transformers.attribute, k);
        if (transformer) {
            transformer.call(this, attrs, k, tplOpts, options, element);
            if (transformer.type === 'for') {
                element.hasForLoop = true;
            }
        }
    });
}

/**
 * Transform text node
 *
 * @inner
 * @param {Object} transformer the text node transformers
 * @param {Object} textNode the text node to process
 * @param {Object} tplOpts the template transform options
 * @param {Object} options the template transform plugin options
 */
function transformTextNode(transformer, textNode, tplOpts, options) {
    let handler = findMatchTransformer(transformer, textNode.data, textNode);
    handler && handler.call(this, textNode, tplOpts, options);
}

exports.normalizeTransformers = normalizeTransformers;

exports.transform = transform;

/**
 * Create syntax transformation plugin
 *
 * @param {Object} transformers the transformers to transform template
 * @return {Object}
 */
exports.createSyntaxPlugin = function (transformers) {
    let {element, attribute, text} = transformers;

    return {
        tag(...args) {
            args.unshift({
                element: normalizeTransformers(element),
                attribute: normalizeTransformers(attribute)
            });
            return transform.apply(this, args);
        },

        text(...args) {
            if (!text) {
                return;
            }

            args.unshift(normalizeTransformers(text));
            return transformTextNode.apply(this, args);
        }
    };
};
