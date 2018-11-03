/**
 * @file Mini program view template syntax transform plugin: okam syntax -> ant syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const {createSyntaxPlugin} = require('./helper');
const transformers = require('../transform/ant');

module.exports = createSyntaxPlugin(transformers);
