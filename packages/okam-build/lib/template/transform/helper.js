/**
 * @file Mini program view template syntax transform plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */

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

function findMatchAttrTransformer(attrTransformers, attrName) {
    return findMatchTransformer(attrTransformers, attrName, attrName);
}

function findMatchElemTransformer(elemTransformers, element) {
    return findMatchTransformer(elemTransformers, element.name, element);
}

exports.normalizeTransformers = function normalizeTransformers(transformerMap) {
    let result = [];
    Object.keys(transformerMap).forEach(k => {
        let item = transformerMap[k];
        if (item) {
            result.push(
                Object.assign({}, item, {name: k})
            );
        }
    });
    return result;
};

exports.transform = function transform(transformers, element, tplOpts, options) {
    // transform element first
    let transformer = findMatchElemTransformer(transformers.element, element);
    transformer && transformer(element, tplOpts);

    // transform element attributes
    let {attribs: attrs} = element;
    attrs && Object.keys(attrs).forEach(k => {
        transformer = findMatchAttrTransformer(transformers.attribute, k);
        transformer && transformer(attrs, k, tplOpts);
    });
};
