/**
 * @file String util test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

import assert from 'assert';
import strUtil from '../../lib/string';

describe('string util', function () {
    it('padZero', function () {
        let value = 233;
        let result = strUtil.padZero(value, 5);
        assert(result === '00' + value);

        value = 33;
        result = strUtil.padZero(value, 1);
        assert(result === `${value}`);

        value = 33;
        result = strUtil.padZero(value, 2);
        assert(result === `${value}`);

        value = 0;
        result = strUtil.padZero(value, 2);
        assert(result === '0' + value);
    });

    it('toHyphen', function () {
        let result = strUtil.toHyphen('Ac');
        assert(result === 'ac');

        result = strUtil.toHyphen('testNa');
        assert(result === 'test-na');

        result = strUtil.toHyphen('TestNa');
        assert(result === 'test-na');

        result = strUtil.toHyphen('TestNaBCdE');
        assert(result === 'test-na-b-cd-e');

        result = strUtil.toHyphen('efg-ka');
        assert(result === 'efg-ka');
    });

    it('format', function () {
        let result = strUtil.format('${ab}: ${c}', {ab: 0, c: '23'});
        assert(result === '0: 23');

        result = strUtil.format('${a}: ${b}', {a: 'a', b: null});
        assert(result === 'a: null');

        assert.throws(() => strUtil.format('${a}: ${b}', {a: true}));

        result = strUtil.format('${a}: ${b}', {a: 'a'}, true);
        assert(result === 'a: undefined');
    });
});
