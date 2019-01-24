/**
 * @file Mini program view template syntax transform plugin: okam syntax -> h5 app syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const {createSyntaxPlugin} = require('../helper');
const transformers = require('../../transform/h5');

module.exports = createSyntaxPlugin(transformers);

