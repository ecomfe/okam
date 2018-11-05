/**
 * @file Transform ant class attribute
 * @author sparklewhy@gmail.com
 */

'use strict';

const classTransformer = require('../base/class');

module.exports = function (attrs, name, tplOpts) {
    return classTransformer(attrs, name, tplOpts, true);
};
