/**
 * @file App test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

import assert from 'assert';
import expect, {createSpy} from 'expect';
import createAppFactory from 'core/App';
import base from 'core/base/base';

describe('App', () => {

    it('should create app factory', () => {
        let appFactory = createAppFactory({});
        assert(typeof appFactory === 'function');
        assert(typeof appFactory.use === 'function');
        assert(typeof appFactory.registerApi === 'function');
    });

    it('should register API', () => {
        expect(Object.keys(base.$api)).toEqual(['request']);

        let appFactory = createAppFactory({});
        let spyHi = createSpy(() => {});
        appFactory.registerApi({hi: spyHi, test222: () => {}});

        expect(Object.keys(base.$api)).toEqual(['request', 'hi', 'test222']);
        base.$api.hi(23);
        expect(spyHi).toHaveBeenCalledWith(23);
        assert(spyHi.calls.length === 1);

        let spyHi2 = createSpy(() => {});
        appFactory.registerApi({hi: spyHi2});
        expect(Object.keys(base.$api)).toEqual(['request', 'hi', 'test222']);
        base.$api.hi(55);
        expect(spyHi2).toHaveBeenCalledWith(55);
        assert(spyHi.calls.length === 1);

        appFactory.registerApi();
        expect(Object.keys(base.$api)).toEqual(['request', 'hi', 'test222']);
    });
});
