/**
 * @file util test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

const assert = require('assert');
const util = require('okam/util');

describe('util', function () {
    it('should have given api', function () {
        assert(util.string != null);
        assert(util.Timer != null);
        assert(util.file != null);
        assert(util.event != null);
        assert(util.logger != null);
        assert(util.require != null);
        assert(util.colors != null);
        assert(util.misc != null);
        assert(util.net != null);
        assert(util.os != null);
    });

    it('should cover to object map', function () {
        let arr = ['a', 11];
        let obj = util.toObjectMap(arr);
        assert(obj.a === true && obj['11'] === true);
    });
});
