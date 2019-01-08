/**
 * @file Ant axml template dependence extract plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const EXTRACT_DEP_TAGS = {
    'import': true,
    'include': true,
    'import-sjs': 'from'
};

module.exports = {
    tag(element, tplOpts) {
        let depAttrName = EXTRACT_DEP_TAGS[element.name];
        if (depAttrName) {
            let {addDep} = tplOpts;
            let {attribs: attrs} = element;
            let srcAttrName = typeof depAttrName === 'string'
                ? depAttrName : 'src';
            let src = attrs && attrs[srcAttrName];
            if (src) {
                addDep(src);
            }
        }
    }
};
