/**
 * @file Redux equal check test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

import assert from 'assert';
import isEqual from 'core/extend/data/equal';

describe('redux equal check', function () {
    it('should check equal', () => {
        assert(isEqual(2, 3) === false);
        assert(isEqual(2, 2) === true);
        assert(isEqual('2', 2) === false);
        assert(isEqual(null, 0) === false);

        assert(isEqual({}, {}) === true);
        assert(isEqual({a: 3}, {a: 3, b: null}) === false);

        assert(isEqual({a: {}}, {a: {}}) === false);

        let obj = {a: 3};
        assert(isEqual({a: obj}, {a: obj}) === true);
        assert(isEqual(obj, obj) === true);

        assert(isEqual([2, 3], [2, 3]) === true);
        assert(isEqual([{}, 3], [{}, 3]) === true);
        assert(isEqual([{a: {}}, 3], [{a: {}}, 3]) === false);
        assert(isEqual([{}, 3], [{}]) === false);
    });
});
