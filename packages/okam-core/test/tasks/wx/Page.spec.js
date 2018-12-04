/**
 * @file Weixin Page test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */
/* eslint-disable fecs-min-vars-per-destructure */

import assert from 'assert';
import expect, {createSpy, spyOn} from 'expect';
import MyApp from 'core/wx/App';
import MyPage from 'core/wx/Page';
import page from 'core/base/page';
import component from 'core/base/component';
import {clearBaseCache} from 'core/helper/factory';
import {testCallOrder, fakeAppEnvAPIs} from 'test/helper';

describe('wx/Page', () => {
    let restoreAppEnv;

    beforeEach('init global App', function () {
        clearBaseCache();
        restoreAppEnv = fakeAppEnvAPIs('wx');
    });

    afterEach('clear global App', function () {
        restoreAppEnv();
        expect.restoreSpies();
    });

    it('should inherit component api', () => {
        let pageInstance = {};
        let page = MyPage(pageInstance);
        Object.keys(component).forEach(k => {
            if (k !== 'methods') {
                assert(page[k] === component[k]);
            }
        });
        Object.keys(component.methods).forEach(k => {
            if (k !== '__beforeEmit') {
                assert(page[k] === component.methods[k]);
            }
        });
    });

    it('should call base onLoad/onReady/onUnload in order', () => {
        const pageInstance = {
            onLoad() {},
            onReady() {},
            onUnload() {}
        };
        testCallOrder(
            ['onLoad', 'onReady', 'onUnload'],
            pageInstance,
            MyPage,
            [page]
        );
    });
});
