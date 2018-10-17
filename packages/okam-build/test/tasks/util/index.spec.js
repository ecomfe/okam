/**
 * @file util test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

const assert = require('assert');
const util = require('okam/util');

describe('util', function () {
    it('should have given api', function () {
        let {string, Timer, file, event, logger, require: customRequire, colors, helper} = util;
        assert(string != null);
        assert(Timer != null);
        assert(file != null);
        assert(event != null);
        assert(logger != null);
        assert(customRequire != null);
        assert(colors != null);
        assert(helper != null);
    });

    it('should cover to object map', function () {
        let arr = ['a', 11];
        let obj = util.toObjectMap(arr);
        assert(obj.a === true && obj['11'] === true);
    });
});
