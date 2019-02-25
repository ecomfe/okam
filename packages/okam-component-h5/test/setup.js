/**
 * @file Test setup
 * @see https://vue-test-utils.vuejs.org/guides/#testing-single-file-components-with-mocha-webpack
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global global: false */

require('jsdom-global')();

// https://github.com/vuejs/vue-cli/issues/2128
window.Date = Date;

global.expect = require('expect');
