
/**
 * @file setup test spec
 * @author magicchewl@gmail.com
 */

'use strict';

/* global global: false */

require('jsdom-global')('', {
    url: 'http://localhost'
});

global.expect = require('expect');
