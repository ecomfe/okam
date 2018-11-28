/**
 * @file na/env test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global before:false */
/* global after:false */

import assert from 'assert';
import * as platform from 'core/na/platform';

describe('na/platform', function () {

    it('should set system info', () => {
        const info = {b: 3};
        platform.setPlatformInfo(info);
        assert(platform.getPlatformInfo() === info);
    });

    it('should be ios', function () {
        let info = {
            platform: 'ios'
        };

        platform.setPlatformInfo(info);
        assert.ok(platform.isIOS());

        info.platform = ' ios';
        assert.ok(!platform.isIOS());

        info.platform = 'ios sdd';
        assert.ok(!platform.isIOS());

        info.platform = 'iOS 10.0.1';
        assert.ok(!platform.isIOS());
    });

    it('should be android', function () {
        let info = {
            platform: 'android'
        };

        platform.setPlatformInfo(info);
        assert.ok(platform.isAndroid());

        info.platform = ' android';
        assert.ok(!platform.isAndroid());

        info.platform = 'android sdd';
        assert.ok(!platform.isAndroid());

        info.platform = 'Android 5.0';
        assert.ok(!platform.isAndroid());
    });
});
