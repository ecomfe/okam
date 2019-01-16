/**
 * @file Mini program view template syntax transform plugin: okam syntax -> toutiao syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const {createSyntaxPlugin} = require('../helper');
const transformers = require('../../transform/tt');

module.exports = createSyntaxPlugin(transformers);

