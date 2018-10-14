/**
 * @file string util test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

const assert = require('assert');
const strUtil = require('../../lib/string');

describe('padZero', function () {
    it('should padding lead zero', function () {
        let value = 233;
        let result = strUtil.padZero(value, 5);
        assert(result === '00' + value);
    });
});
