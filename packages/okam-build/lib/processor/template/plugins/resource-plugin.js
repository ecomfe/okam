/**
 * @file Template resource dependence analysis plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const {resolveUrlPath} = require('../../helper/url');

module.exports = {
    tag(element, tplOpts, options) {
        let {file, resolve, logger, config} = tplOpts;
        let {resourceTags} = config.template || {};
        let {tags} = options || {};
        if (resourceTags && tags) {
            tags = Object.assign({}, resourceTags, tags);
        }
        else if (!tags) {
            tags = resourceTags;
        }

        let {attribs: attrs, name} = element;
        let srcAttrName = tags && tags[name];
        if (srcAttrName === false) {
            return;
        }

        if (!srcAttrName || typeof srcAttrName !== 'string') {
            srcAttrName = 'src';
        }

        let src = attrs && attrs[srcAttrName];
        let relPath = src && resolveUrlPath(src, file, resolve, logger);
        if (relPath) {
            attrs[srcAttrName] = relPath;
        }
    }
};
