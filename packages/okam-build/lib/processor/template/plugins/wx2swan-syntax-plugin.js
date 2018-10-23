/**
 * @file Mini program view template syntax transform plugin: wx syntax -> swan syntax
 * @author xiaohong8023@outlook.com
 */

'use strict';

const {createSyntaxPlugin} = require('./helper');
const transformers = require('../transform/wx2swan');

module.exports = createSyntaxPlugin(transformers);

