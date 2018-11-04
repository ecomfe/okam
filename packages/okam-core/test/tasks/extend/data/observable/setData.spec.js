/**
 * @file Data observable setData test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */

import assert from 'assert';
import expect from 'expect';
import {getSetDataPaths} from 'core/extend/data/observable/setData';

describe('observable/setData', function () {
    it('should merge same path set', function () {
        let result = getSetDataPaths([{a: 34, b: 56}]);
        expect(result).toEqual({a: 34, b: 56});

        result = getSetDataPaths([
            {a: {b: 3}, b: 56},
            {a: 34}
        ]);
        expect(result).toEqual({a: 34, b: 56});

        result = getSetDataPaths([
            {a: {b: 3}, b: 56},
            {b: true},
            {c: 3, a: 6}
        ]);
        expect(result).toEqual({
            a: 6,
            b: true,
            c: 3
        });
    });

    it('should convert undefined data value to null', function () {
        let result = getSetDataPaths([
            {a: undefined, b: 56},
            {'c.k': true}
        ]);
        expect(result).toEqual({
            a: null,
            b: 56,
            'c.k': true
        });
    });

    it('should merge no effective set', function () {
        let result = getSetDataPaths([
            {a: {b: 3}, b: 56},
            {a: 23}
        ]);
        expect(result).toEqual({
            a: 23,
            b: 56
        });

        result = getSetDataPaths([
            {a: {b: 3}, b: 56},
            {'a.b': 23}
        ]);
        expect(result).toEqual({
            a: {b: 3},
            b: 56,
            'a.b': 23
        });

        result = getSetDataPaths([
            {'a.b.c': 56},
            {'a.b': 23},
            {c: 55, 'a.b': {a: 3}}
        ]);
        expect(result).toEqual({
            'a.b': {a: 3},
            c: 55
        });

        result = getSetDataPaths([
            {'a.b.c': 56},
            {'a.b0': 23, 'd.arr': [1]},
            {c: 55, 'arr[0]': {a: 3}},
            {arr: [], 'arr[1]': 23, 'd.arr[0]': 23}
        ]);
        expect(result).toEqual({
            'a.b.c': 56,
            'a.b0': 23,
            'd.arr': [1],
            c: 55,
            arr: [],
            'arr[1]': 23,
            'd.arr[0]': 23
        });
    });
});
