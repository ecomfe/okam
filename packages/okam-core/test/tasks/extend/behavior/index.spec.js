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
import MyComponent from 'core/Component';
import * as na from 'core/na/index';
import base from 'core/base/base';
import component from 'core/base/component';
import {clearBaseCache} from 'core/helper/factory';
import behavior from 'core/extend/behavior/index';
import createBehavior from 'core/extend/behavior/Behavior';

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

        global.Behavior = function (instance) {
            return instance;
        };
    });

    afterEach('clear global App', function () {
        global.Component = undefined;
        global.Page = undefined;
        global.Behavior = undefined;
        global.swan = undefined;
        component.selectComponent = rawSelectComponent;
        na.getCurrApp = rawGetCurrApp;
        na.env = base.$api = rawEnv;
        expect.restoreSpies();
    });

    it('should support mixin for page', function () {
        MyApp.use(behavior);

        const lifeCycleHooks = [
            'beforeCreate',
            'created',
            'beforeMount',
            'mounted',
            'beforeDestroy',
            'destroyed',
            'beforeUpdate',
            'updated'
        ];

        let spyMixinHi = createSpy(() => {});
        let spyMixinTest = createSpy(() => {});
        let mixin = {
            data: {
                a: {
                    b: 2,
                    c: {
                        d: 3,
                        f: 'str'
                    }
                },
                arr: []
            },
            computed: {
                ab() {
                    return this.a.b;
                }
            },
            methods: {
                hi: spyMixinHi,
                test: spyMixinTest
            }
        };

        // init mixin hooks
        const lifeCycleCallOrders = {};
        const spyHooks = {};
        lifeCycleHooks.forEach(name => {
            let orders = lifeCycleCallOrders[name] = [];
            let hooks = spyHooks[name] = [];
            mixin[name] = createSpy(function () {}).andCall(
                () => orders.push(1)
            );
            hooks.push(mixin[name]);
        });
        mixin = createBehavior(mixin);

        let spyPageTest = createSpy(() => {});
        let page = {
            mixins: [mixin],
            data: {
                c: 'ss',
                arr: [23],
                a: {
                    b: 56,
                    c: {
                        d: 66,
                        e: 58
                    },
                    k: true
                }
            },
            methods: {
                test2() {},
                test: spyPageTest
            }
        };

        // init page hooks
        lifeCycleHooks.forEach(name => {
            let orders = lifeCycleCallOrders[name];
            let hooks = spyHooks[name];
            page[name] = createSpy(function () {}).andCall(
                () => orders.push(2)
            );
            hooks.push(page[name]);
        });

        page = MyPage(page);

        page.onLoad();
        page.onReady();

        expect(page.data).toEqual({
            c: 'ss',
            arr: [23],
            a: {b: 56, c: {d: 66, e: 58, f: 'str'}, k: true}
        });

        assert(page.behaviors === undefined);

        assert(typeof page.test2 === 'function');
        page.test();
        expect(spyPageTest).toHaveBeenCalled();
        assert(spyPageTest.calls.length === 1);
        expect(spyPageTest.calls[0].context).toBe(page);
        expect(spyMixinTest).toNotHaveBeenCalled();

        assert(typeof page.hi === 'function');
        page.hi();
        expect(spyMixinHi).toHaveBeenCalled();
        expect(spyMixinHi.calls[0].context).toBe(page);
        assert(spyMixinHi.calls.length === 1);

        page.beforeUpdate();
        page.updated();

        page.onUnload();

        lifeCycleHooks.forEach(name => {
            let orders = lifeCycleCallOrders[name];
            let hooks = spyHooks[name];

            hooks.forEach(spy => {
                expect(spy).toHaveBeenCalled();
                expect(spy.calls[0].context).toBe(page);
                assert(spy.calls.length === 1);
            });

            assert(orders.join('') === '12');
        });
    });

    it('should support mixin for component', function () {
        MyApp.use(behavior);

        const lifeCycleHooks = [
            'beforeCreate',
            'created',
            'beforeMount',
            'mounted',
            'beforeDestroy',
            'destroyed',
            'beforeUpdate',
            'updated'
        ];

        let spyMixinHi = createSpy(() => {});
        let spyMixinReady = createSpy(() => {});
        let rawMixin = {
            props: {
                a: null
            },
            data: {
                d: 2
            },
            computed: {
                ab() {
                    return this.a.b;
                }
            },
            ready: spyMixinReady,
            methods: {
                hi: spyMixinHi
            }
        };

        // init mixin hooks
        const lifeCycleCallOrders = {};
        const spyHooks = {};
        lifeCycleHooks.forEach(name => {
            let orders = lifeCycleCallOrders[name] = [];
            let hooks = spyHooks[name] = [];
            rawMixin[name] = createSpy(function () {}).andCall(
                () => orders.push(1)
            );
            hooks.push(rawMixin[name]);
        });
        let mixin = createBehavior(rawMixin);

        let spyComponentTest = createSpy(() => {});
        let component = {
            mixins: [mixin],
            data: {
                c: 1
            },
            methods: {
                test: spyComponentTest
            }
        };

        // init component hooks
        lifeCycleHooks.forEach(name => {
            let orders = lifeCycleCallOrders[name];
            let hooks = spyHooks[name];
            component[name] = createSpy(function () {}).andCall(
                () => orders.push(2)
            );
            hooks.push(component[name]);
        });

        component = MyComponent(component);

        component.created();
        component.attached();
        component.ready();

        assert(component.behaviors.length === 1);
        expect(component.behaviors[0]).toEqual({
            properties: rawMixin.props,
            data: rawMixin.data,
            ready: rawMixin.ready,
            created: rawMixin.created,
            methods: rawMixin.methods
        });
        expect(component.data).toEqual({c: 1});

        expect(spyMixinReady).toNotHaveBeenCalled();
        expect(Object.keys(component.behaviors[0].methods)).toEqual(['hi']);
        component.test();
        expect(spyComponentTest).toHaveBeenCalled();
        assert(spyComponentTest.calls.length === 1);
        expect(spyComponentTest.calls[0].context).toBe(component);

        assert(typeof component.hi !== 'function');

        component.beforeUpdate();
        component.updated();

        component.detached();

        lifeCycleHooks.forEach(name => {
            let orders = lifeCycleCallOrders[name];
            let hooks = spyHooks[name];

            if (name === 'created') {
                expect(hooks[0]).toNotHaveBeenCalled();
                expect(hooks[1]).toHaveBeenCalled();
                expect(hooks[1].calls[0].context).toBe(component);
                assert(hooks[1].calls.length === 1);
            }
            else {
                hooks.forEach(spy => {
                    expect(spy).toHaveBeenCalled();
                    expect(spy.calls[0].context).toBe(component);
                    assert(spy.calls.length === 1);
                });

                assert(orders.join('') === '12');
            }
        });
    });

});
