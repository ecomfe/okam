/**
 * @file na/env test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global before:false */
/* global after:false */

import assert from 'assert';
import expect, {createSpy, spyOn} from 'expect';
import * as na from 'core/na/index';
import * as env from 'core/na/env';

describe('na/env', function () {
    const rawGetSystemInfo = na.env.getSystemInfo;
    before('fake getSystemInfo', () => {
        na.env.getSystemInfo = () => {};
    });

    after('restore getSystemInfo', () => {
        na.env.getSystemInfo = rawGetSystemInfo;
    });

    afterEach(() => {
        expect.restoreSpies();
    });

    it('should be init system info', function (done) {
        env.setSystemInfo(undefined);
        let spyGetSystemInfo = spyOn(na.env, 'getSystemInfo').andCall(
            opts => {
                setTimeout(() => {
                    opts.success({a: 3});
                });
            }
        );
        let spyCallback = createSpy(() => {});

        env.initSystemInfo(spyCallback);
        env.initSystemInfo(spyCallback);

        setTimeout(() => {
            expect(spyGetSystemInfo).toHaveBeenCalled();
            assert(spyGetSystemInfo.calls.length === 1);
            expect(spyCallback).toHaveBeenCalledWith(null, {a: 3});
            assert(spyCallback.calls.length === 1);

            env.initSystemInfo(spyCallback);
            assert(spyCallback.calls.length === 2);
            expect(spyCallback.calls[1].arguments).toEqual([null, {a: 3}]);
            assert(spyGetSystemInfo.calls.length === 1);

            done();
        }, 10);
    });

    it('should be set system info false when fail', function (done) {
        env.setSystemInfo(undefined);
        let spyGetSystemInfo = spyOn(na.env, 'getSystemInfo').andCall(
            opts => {
                setTimeout(() => {
                    opts.fail('err');
                });
            }
        );
        let spyCallback = createSpy(() => {});
        env.initSystemInfo(spyCallback);
        setTimeout(() => {
            expect(spyGetSystemInfo).toHaveBeenCalled();
            assert(spyGetSystemInfo.calls.length === 1);
            expect(spyCallback).toHaveBeenCalledWith('err');
            assert(spyCallback.calls.length === 1);

            env.initSystemInfo(spyCallback);
            assert(spyCallback.calls.length === 1);

            done();
        }, 10);
    });

    it('should set system info', () => {
        const info = {b: 3};
        env.setSystemInfo(info);
        assert(env.getSystemInfo() === info);
    });

    it('should throw exception if the system info is not set', () => {
        env.setSystemInfo(false);
        assert.throws(env.getSystemInfo);

        env.setSystemInfo(null);
        assert.throws(env.getSystemInfo);
    });

    it('should be ios', function () {
        let info = {
            system: 'ios'
        };

        env.setSystemInfo(info);
        assert.ok(env.isIOS());
        assert.ok(!env.isIOS({system: 'xxx'}));

        info.system = ' ios';
        assert.ok(!env.isIOS());

        info.system = 'ios sdd';
        assert.ok(env.isIOS());

        info.system = 'iOS 10.0.1';
        assert.ok(env.isIOS());
    });

    it('should be android', function () {
        let info = {
            system: 'android'
        };

        env.setSystemInfo(info);
        assert.ok(env.isAndroid());
        assert.ok(!env.isAndroid({system: 'xxx'}));

        info.system = ' android';
        assert.ok(!env.isAndroid());

        info.system = 'android sdd';
        assert.ok(env.isAndroid());

        info.system = 'Android 5.0';
        assert.ok(env.isAndroid());
    });
});
