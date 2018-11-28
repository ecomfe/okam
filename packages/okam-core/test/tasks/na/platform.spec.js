/**
 * @file na/env test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global before:false */
/* global after:false */

import assert from 'assert';
import expect, {createSpy, spyOn} from 'expect';
import * as platform from 'core/na/platform';

describe('na/platform', function () {

    afterEach(() => {
        expect.restoreSpies();
    });

    it('should set system info', () => {
        const info = {b: 3};
        platform.setSystemInfo(info);
        assert(platform.getSystemInfo() === info);
    });

    it('should be ios', function () {
        let info = {
            platform: 'ios'
        };

        platform.setSystemInfo(info);
        assert.ok(platform.isIOS());
        assert.ok(!platform.isIOS({system: 'xxx'}));

        info.system = ' ios';
        assert.ok(!platform.isIOS());

        info.system = 'ios sdd';
        assert.ok(platform.isIOS());

        info.system = 'iOS 10.0.1';
        assert.ok(platform.isIOS());
    });

    it('should be android', function () {
        let info = {
            platform: 'android'
        };

        platform.setSystemInfo(info);
        assert.ok(platform.isAndroid());
        assert.ok(!platform.isAndroid({system: 'xxx'}));

        info.system = ' android';
        assert.ok(!platform.isAndroid());

        info.system = 'android sdd';
        assert.ok(platform.isAndroid());

        info.system = 'Android 5.0';
        assert.ok(platform.isAndroid());
    });
});
