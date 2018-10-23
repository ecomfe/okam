/**
 * @file Mini program view template syntax transform plugin: okam syntax -> swan syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const {createSyntaxPlugin} = require('./helper');
const transformers = require('../transform/swan');

module.exports = createSyntaxPlugin(transformers);

