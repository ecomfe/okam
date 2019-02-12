/**
 * @file OKAM build entrance
 * @author sparklewhy@gmail.com
 */

'use strict';

const {h5ToMiniProgram, miniProgramToH5} = require('./lib/util/tag-map');

// 用于 `component.template.transformTags` 配置项
exports.reverseTagMap = require('./lib/util/tag-transform-helper');
exports.defaultH5TagToMiniProgram = h5ToMiniProgram;
exports.defaultMiniProgramTagToH5 = miniProgramToH5;
exports.merge = require('./lib/util').merge;
exports.run = require('./lib/build');
