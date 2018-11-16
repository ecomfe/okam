/**
 * @file Swan observable data test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */

import assert from 'assert';
import expect, {createSpy} from 'expect';
import MyApp from 'core/App';
import MyPage from 'core/Page';
import {clearBaseCache} from 'core/helper/factory';
import observable from 'core/extend/data/observable/swan';
import {fakeComponent, fakeAppEnvAPIs} from 'test/helper';

describe('swan observable', function () {
    let MyComponent;
    let restoreAppEnv;

    beforeEach('init global App', function () {
        clearBaseCache();

        MyComponent = fakeComponent();
        restoreAppEnv = fakeAppEnvAPIs('swan');
    });

    afterEach('clear global App', function () {
        MyComponent = undefined;
        restoreAppEnv();
        expect.restoreSpies();
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
            d: {a: 3, b: [55, 23]},
            e: [23, {b: 33}]
        });
        assert(instance.a === 66);
        assert(instance.b === 'ee');
        assert(instance.c === false);
        expect(instance.d).toEqual({a: 3, b: [55, 23]});
        expect(instance.e).toEqual(instance.data.e);

        expect(spySetData).toNotHaveBeenCalled();
        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            expect(spySetData.calls[0].context).toBe(instance);
            expect(spySetData.calls[0].arguments[0]).toEqual({
                'a': 66,
                'b': 'ee',
                'c': false,
                'd.b': [55, 23],
                'e[1].b': 33
            });
            done();
        });
    });

    it('should call updated hook when update data done', function (done) {
        let spyUpdated = createSpy(() => {});
        MyApp.use(observable);
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

        expect(spyUpdated).toNotHaveBeenCalled();

        setTimeout(() => {
            expect(spyUpdated).toHaveBeenCalled();
            assert(spyUpdated.calls.length === 1);
            done();
        }, 20);

    });
});
