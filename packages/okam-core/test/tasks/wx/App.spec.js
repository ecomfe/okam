/**
 * @file Wx App test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */
/* eslint-disable fecs-min-vars-per-destructure */

import assert from 'assert';
import expect from 'expect';
import MyApp from 'core/wx/App';
import application from 'core/base/application';
import base from 'core/base/base';
import {clearBaseCache} from 'core/helper/factory';
import {testCallOrder, fakeAppEnvAPIs} from 'test/helper';

describe('wx/App', () => {
    let restoreAppEnv;
    beforeEach('init global App', function () {
        clearBaseCache();
        restoreAppEnv = fakeAppEnvAPIs('wx');
    });

    afterEach('clear global App', function () {
        restoreAppEnv();
        expect.restoreSpies();
    });

    it('should inherit base api', () => {
        let appInstance = {};
        let app = MyApp(appInstance);
        app.onLaunch();

        Object.keys(base).forEach(k => {
            assert(app[k] === base[k]);
        });
    });

    it('should call base onLaunch/onShow in order', () => {
        const appInstance = {
            onLaunch() {},
            onShow() {}
        };
        testCallOrder(
            ['onLaunch', 'onShow'],
            appInstance,
            MyApp,
            [application]
        );
    });

});
