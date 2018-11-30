/**
 * @file OKAM build entrance
 * @author sparklewhy@gmail.com
 */

'use strict';

// 用于 `component.template.transformTags` 配置项
exports.reverseTagMap = require('./lib/util/tag-tansform-helper');
exports.merge = require('./lib/util').merge;
exports.run = require('./lib/build');
