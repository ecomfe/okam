/**
 * @file na/index test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

import assert from 'assert';
import expect, {createSpy} from 'expect';
import * as na from 'core/na';

describe('na/index', function () {

    it('should be node env', () => {
        assert(na.isSwanEnv === false);
        assert(na.isWxEnv === false);
        assert(na.isAntEnv === false);
        assert(na.env === global);
        assert(na.g === global);
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
