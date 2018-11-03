/**
 * @file Swan observable data test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */

import assert from 'assert';
import expect, {createSpy, spyOn} from 'expect';
import MyApp from 'core/App';
import MyPage from 'core/Page';
import * as na from 'core/na/index';
import base from 'core/base/base';
import component from 'core/base/component';
import {clearBaseCache} from 'core/helper/factory';
import {
    initSwanObservableArray,
    resetObservableArray,
    swanObservablePlugin as observable
} from '../helper';
import {fakeComponent} from 'test/helper';

describe('swan observable', function () {
    const rawEnv = na.env;
    const rawGetCurrApp = na.getCurrApp;

    const componentFakeMethods = [
        'selectComponent',
        'pushData', 'popData',
        'unshiftData', 'shiftData',
        'spliceData'
    ];
    const rawComponentMethods = [];
    componentFakeMethods.forEach(
        m => rawComponentMethods.push(component[m])
    );

    let MyComponent;

    beforeEach('init global App', function () {
        clearBaseCache();
        initSwanObservableArray();

        MyComponent = fakeComponent();

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

        componentFakeMethods.forEach(
            m => {
                component[m] = (...args) => {
                    let callback = args[args.length - 1];
                    if (typeof callback === 'function') {
                        callback();
                    }
                };
            }
        );
        component.selectComponent = function (path) {
            return 'c' + path;
        };

        na.getCurrApp = function () {
            return {};
        };
        na.env = base.$api = global.swan;
    });

    afterEach('clear global App', function () {
        MyComponent = undefined;
        global.swan = undefined;
        na.getCurrApp = rawGetCurrApp;
        na.env = base.$api = rawEnv;
        expect.restoreSpies();
        componentFakeMethods.forEach(
            (m, idx) => (component[m] = rawComponentMethods[idx])
        );
        resetObservableArray();
    });

    it('should support Vue data access way', () => {
        MyApp.use(observable);

        let obj = {c: 3};
        let arr = [12, {d: 78}];
        let page = MyPage({
            data: {
                a: obj,
                b: arr,
                c: 'ss'
            },
            created() {
                expect(this.a).toEqual(obj);
                expect(this.b).toEqual(arr);
                assert(this.c === 'ss');
                assert(this.a.c === 3);
                assert(this.b[1].d === 78);
            }
        });
        page.onLoad();
    });

    it('should make data observable', function (done) {
        MyApp.use(observable);
        let spyUnshiftData = spyOn(component, 'unshiftData');
        let instance = MyComponent({
            data: {
                a: 3,
                b: 'str',
                c: true,
                d: {a: 3, b: [23]},
                e: [23, {b: 56}]
            },

            created() {
                assert(this.a === this.data.a);
                assert(this.b === this.data.b);
                assert(this.c === this.data.c);
                expect(this.d).toEqual(this.data.d);
                expect(this.e).toEqual(this.data.e);
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();

        instance.a = 66;
        instance.b = 'ee';
        instance.c = false;
        instance.d.b.unshift(55);
        instance.e.getItem(1).b = 33;
        expect(instance.data).toEqual({
            a: 66,
            b: 'ee',
            c: false,
            // native api should implement the data update
            // because here is empty fake, so the value of b is [23]
            // not [55, 23]
            d: {a: 3, b: [23]},
            e: [23, {b: 33}]
        });
        assert(instance.a === 66);
        assert(instance.b === 'ee');
        assert(instance.c === false);
        expect(instance.d).toEqual({a: 3, b: [55, 23]});
        expect(instance.e).toEqual(instance.data.e);

        expect(spySetData).toNotHaveBeenCalled();
        setTimeout(() => {
            expect(spyUnshiftData).toHaveBeenCalled();
            assert(spyUnshiftData.calls.length === 1);
            expect(spyUnshiftData.calls[0].context).toBe(instance);
            expect(spyUnshiftData.calls[0].arguments.slice(0, 2)).toEqual(
                ['d.b', [55]]
            );

            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            expect(spySetData.calls[0].context).toBe(instance);
            expect(spySetData.calls[0].arguments[0]).toEqual({
                'a': 66,
                'b': 'ee',
                'c': false,
                'e[1].b': 33
            });
            done();
        });
    });

    it('should call updated hook when update data done', function (done) {
        let spyUpdated = createSpy(() => {});
        MyApp.use(observable);
        let spyUnshiftData = spyOn(component, 'unshiftData').andCallThrough();
        let instance = MyComponent({
            data: {
                a: 3,
                e: [23, {b: 56}]
            },
            updated: spyUpdated
        });

        let spySetData = createSpy((arg, callback) => {
            setTimeout(() => callback(), 10);
        }).andCallThrough();
        instance.setData = spySetData;
        instance.created();
        instance.a = 66;
        instance.e.unshift(66);

        expect(spyUnshiftData).toHaveBeenCalled();
        expect(spyUpdated).toNotHaveBeenCalled();

        setTimeout(() => {
            expect(spyUnshiftData).toHaveBeenCalled();
            assert(spyUnshiftData.calls.length === 1);
            expect(spyUpdated).toHaveBeenCalled();
            assert(spyUpdated.calls.length === 1);
            done();
        }, 20);

    });
});
