/**
 * @file Data observable helper test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */

import assert from 'assert';
import expect from 'expect';
import * as helper from 'core/extend/data/observable/helper';

describe('observable/helper', function () {
    it('should addSelectorPath', function () {
        let result = helper.addSelectorPath('abc', 0);
        assert(result === 'abc[0]');

        result = helper.addSelectorPath('abc', '0');
        assert(result === 'abc.0');

        result = helper.addSelectorPath('abc', '');
        assert(result === 'abc.');

        result = helper.addSelectorPath(null, 's');
        assert(result === 's');

        result = helper.addSelectorPath('', 's');
        assert(result === '.s');

        result = helper.addSelectorPath('abc.2', 'a.3');
        assert(result === 'abc.2.a.3');
    });

    it('should getDataSelector', function () {
        let result = helper.getDataSelector([]);
        assert(result === null);

        result = helper.getDataSelector(['']);
        assert(result === '');

        result = helper.getDataSelector(['sd']);
        assert(result === 'sd');

        result = helper.getDataSelector(['', 'a', 2]);
        assert(result === '.a[2]');

        result = helper.getDataSelector(['sd.2', 'ab', '0', 0]);
        assert(result === 'sd.2.ab.0[0]');
    });

    it('should addDep', function () {
        let result = helper.addDep([], ['arr', 0, 'arr2', 1, 'b']);
        expect(result).toEqual([['arr']]);

        result = helper.addDep([], ['obj', '0', 'arr2', 1, 'b']);
        expect(result).toEqual([['obj', '0', 'arr2']]);

        result = helper.addDep([['obj', 'a']], ['obj', 'a', 'arr2', 1, 'b']);
        expect(result).toEqual([['obj', 'a', 'arr2']]);

        result = helper.addDep([['obj', 'a']], ['obj', 'a', 0, 'b']);
        expect(result).toEqual([['obj', 'a']]);

        result = helper.addDep([['obj', 'a']], ['obj', 'a2', 0, 'b']);
        expect(result).toEqual([['obj', 'a'], ['obj', 'a2']]);

        result = helper.addDep([['c'], ['obj', 'a', 'b']], ['obj', 'a', 0, 'b']);
        expect(result).toEqual([['c'], ['obj', 'a', 'b']]);
    });

    it('should isWatchChange', function () {
        let result = helper.isWatchChange(['a'], ['b']);
        assert.ok(!result);

        result = helper.isWatchChange(['a'], ['a']);
        assert.ok(result);

        result = helper.isWatchChange(['a'], ['a.b']);
        assert.ok(!result);

        result = helper.isWatchChange(['a.b'], ['a']);
        assert.ok(!result);

        result = helper.isWatchChange(['a'], ['a', 'b']);
        assert.ok(result);

        result = helper.isWatchChange(['a', 'b'], ['a', 'b']);
        assert.ok(result);

        result = helper.isWatchChange(['a', 'b', 'c'], ['a', 'b']);
        assert.ok(!result);

        result = helper.isWatchChange(['a', 'b', 0], ['a', 'b']);
        assert.ok(result);

        result = helper.isWatchChange(['a', 'b', 0, 'c'], ['a', 'b']);
        assert.ok(result);

        result = helper.isWatchChange(['a', 'b', 0, 'c'], ['a']);
        assert.ok(!result);

        result = helper.isWatchChange(['a', 'b', 0, 'c'], ['a'], {deep: true});
        assert.ok(result);

        result = helper.isWatchChange(['a', 1, 'c'], ['a', 0]);
        assert.ok(!result);

        result = helper.isWatchChange(['a', '0', 'c'], ['a', 0]);
        assert.ok(!result);

        result = helper.isWatchChange(['a', 'b', '0'], ['a', 'b']);
        assert.ok(!result);
    });
});
