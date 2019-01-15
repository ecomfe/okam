/**
 * @file Mini program view template syntax transform plugin: okam syntax -> quick app syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const {createSyntaxPlugin} = require('../helper');
const transformers = require('../../transform/quick');

module.exports = createSyntaxPlugin(transformers);

