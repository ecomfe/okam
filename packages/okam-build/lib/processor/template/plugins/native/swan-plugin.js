/**
 * @file Swan template dependence extract plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const EXTRACT_DEP_TAGS = {
    import: true,
    include: true,
    filter: true
};

module.exports = {
    tag(element, tplOpts) {
        if (EXTRACT_DEP_TAGS[element.name]) {
            let {addDep} = tplOpts;
            let {attribs: attrs} = element;
            let src = attrs && attrs.src;
            if (src) {
                addDep(src);
            }
        }
    }
};
