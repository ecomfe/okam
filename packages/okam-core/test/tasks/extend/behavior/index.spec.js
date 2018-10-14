/**
 * @file Behavior support test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */
/* eslint-disable fecs-properties-quote */

import assert from 'assert';
import expect, {createSpy} from 'expect';
import MyApp from 'core/App';
import MyPage from 'core/Page';
import * as na from 'core/na/index';
import base from 'core/base/base';
import component from 'core/base/component';
import {clearBaseCache} from 'core/helper/factory';
import behavior from 'core/extend/behavior/index';

describe('behavior', function () {
    const rawEnv = na.env;
    const rawGetCurrApp = na.getCurrApp;
    const rawSelectComponent = component.selectComponent;
    beforeEach('init global App', function () {
        clearBaseCache();
        global.swan = {
            getSystemInfo() {},
            request() {},
            createSelectorQuery() {
                return {
                    select(path) {
                        return path;
                    }
                };
            }
        };

        component.selectComponent = function (path) {
            return 'c' + path;
        };

        na.getCurrApp = function () {
            return {};
        };
        na.env = base.$api = global.swan;

        global.Component = function (instance) {
            Object.assign(instance, instance.methods);
            return instance;
        };

        global.Page = function (instance) {
            return instance;
        };
    });

    afterEach('clear global App', function () {
        global.Component = undefined;
        global.Page = undefined;
        global.swan = undefined;
        component.selectComponent = rawSelectComponent;
        na.getCurrApp = rawGetCurrApp;
        na.env = base.$api = rawEnv;
        expect.restoreSpies();
    });

    it('should support mixin for page', function () {
        MyApp.use(behavior);

        let callCreatedOrder = [];
        let spyMixinCreated = createSpy(function () {}).andCall(
            () => callCreatedOrder.push(1)
        );
        let spyMixinHi = createSpy(function () {});
        let mixin = {
            created: spyMixinCreated,
            methods: {
                hi: spyMixinHi
            }
        };

        let spyPageCreated = createSpy(function () {}).andCall(
            () => callCreatedOrder.push(2)
        );
        let page = MyPage({
            mixins: [mixin],
            data: {
                c: 'ss'
            },
            created: spyPageCreated
        });
        page.onLoad();

        expect(spyMixinCreated).toHaveBeenCalled();
        expect(spyMixinCreated.calls[0].context).toBe(page);
        assert(spyMixinCreated.calls.length === 1);

        expect(spyPageCreated).toHaveBeenCalled();
        expect(spyPageCreated.calls[0].context).toBe(page);
        assert(spyPageCreated.calls.length === 1);

        assert(callCreatedOrder.join('') === '12');

        assert(typeof page.hi === 'function');
        page.hi();
        expect(spyMixinHi).toHaveBeenCalled();
        expect(spyMixinHi.calls[0].context).toBe(page);
        assert(spyMixinHi.calls.length === 1);
    });

});
