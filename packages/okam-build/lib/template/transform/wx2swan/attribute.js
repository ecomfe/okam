/**
 * @file Element attribute transformer
 * @author xiaohong8023@outlook.com
 */

'use strict';

const {WX_DIRECTIVES_REGEXP} = require('./constant');
const directivesTransform = require('./directives');

module.exports = {
    directives: {
        match: WX_DIRECTIVES_REGEXP,
        transform: directivesTransform
    }
};
