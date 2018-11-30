/**
 * @file na/index test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

import assert from 'assert';
import expect, {createSpy} from 'expect';
import * as na from 'core/na';
import {fakeAppEnvAPIs} from 'test/helper';

describe('na/index', function () {
    let restoreAppEnv;
    beforeEach('init global App', function () {
        restoreAppEnv = fakeAppEnvAPIs('swan');
    });

    afterEach('clear global App', function () {
        restoreAppEnv();
        expect.restoreSpies();
    });

    it('should have APIs', () => {
        assert(na.appEnv && typeof na.appEnv === 'object');
        assert(na.appGlobal && typeof na.appGlobal === 'object');
        assert(na.api && typeof na.api === 'object');
        assert(na.getCurrApp && typeof na.getCurrApp === 'function');
        assert(na.getCurrPages && typeof na.getCurrPages === 'function');
    });

    it('getCurrPages', () => {
        let rawGetCurrPages = global.getCurrentPages;
        let spyGetCurrPages = createSpy(() => {});
        global.getCurrentPages = spyGetCurrPages;
        na.getCurrPages();

        expect(spyGetCurrPages).toHaveBeenCalledWith();
        global.getCurrentPages = rawGetCurrPages;
    });

    it('getCurrApp', () => {
        let rawGetCurrApp = global.getApp;
        let spyGetCurrApp = createSpy(() => {});
        global.getApp = spyGetCurrApp;
        na.getCurrApp();
        expect(spyGetCurrApp).toHaveBeenCalledWith();
        global.getApp = rawGetCurrApp;
    });
});
