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
        let resourceAttrNames = tags && tags[name];
        if (resourceAttrNames === false) {
            return;
        }

        if (!resourceAttrNames || resourceAttrNames === true) {
            resourceAttrNames = ['src'];
        }
        else if (!Array.isArray(resourceAttrNames)) {
            resourceAttrNames = [resourceAttrNames];
        }

        resourceAttrNames.forEach(name => {
            let src = attrs && attrs[name];
            let relPath = src && resolveUrlPath(src, file, resolve, logger);
            if (relPath) {
                attrs[name] = relPath;
            }
        });
    }
};
