/**
 * @file Process swan native filter tag
 * @author sparklewhy@gmail.com
 */

'use strict';

module.exports = function (element, tplOpts, opts) {
    let {addDep} = tplOpts;
    let {attribs: attrs} = element;
    let src = attrs && attrs.src;
    if (src) {
        addDep(src);
    }
};
