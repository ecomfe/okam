/**
 * @file H5 app template event attribute transform plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const {createSyntaxPlugin} = require('../helper');
const {EVENT_REGEXP} = require('../../transform/base/constant');
const {toHyphen} = require('../../../../util').string;

module.exports = createSyntaxPlugin({
    attribute: {
    }
});
