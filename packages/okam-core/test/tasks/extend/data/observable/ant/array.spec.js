/**
 * @file Ant observable array test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */
/* global before:false */
/* global after:false */

import assert from 'assert';
import expect, {createSpy, spyOn} from 'expect';
import MyApp from 'core/ant/App';
import component from 'core/ant/base/component';
import {clearBaseCache} from 'core/helper/factory';
import observable from 'core/extend/data/observable/ant';
import {fakeAntComponent, fakeAppEnvAPIs} from 'test/helper';
import {resetObservableArray, initAntObservableArray, fakeAntArrayAPIs} from '../helper';

describe('Ant array observable', function () {
    let MyComponent;
    let restoreAntArrayApi;
    let restoreAppEnv;

    before('init observable array', function () {
        initAntObservableArray();
    });

    after('restore observable array', function () {
        resetObservableArray();
    });

    beforeEach('init global App', function () {
        clearBaseCache();

        MyComponent = fakeAntComponent();
        restoreAntArrayApi = fakeAntArrayAPIs();
        restoreAppEnv = fakeAppEnvAPIs('ant');
    });

    afterEach('clear global App', function () {
        expect.restoreSpies();

        MyComponent = undefined;
        restoreAppEnv();
        restoreAntArrayApi();
    });

    it('should not update array when update array using index', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                a: {a: 3, b: [23]},
                b: [23, {b: 56}]
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.didMount();
        instance.a.b[0] = 5;
        instance.b[2] = 6;
        expect(instance.data).toEqual({
            a: {a: 3, b: [23]},
            b: [23, {b: 56}]
        });

        setTimeout(() => {
            expect(spySetData).toNotHaveBeenCalled();
            done();
        });
    });

    it('should update array item using setItem', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                a: {a: 3, b: [23]},
                b: [23, {b: 56}]
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.didMount();
        instance.a.b.setItem(0, 5);
        instance.b.setItem(2, 6);
        expect(instance.data).toEqual({
            a: {a: 3, b: [5]},
            b: [23, {b: 56}, 6]
        });

        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            expect(spySetData.calls[0].arguments[0]).toEqual(
                {'a.b[0]': 5, 'b[2]': 6}
            );
            done();
        });
    });

    it('should return array item using getItem by index', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                a: {a: 3, b: [23]},
                b: [23, {b: 56}]
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.didMount();
        assert(instance.a.b.getItem(0) === 23);
        assert(instance.a.b.getItem(1) === undefined);
        instance.b.getItem(1).b = 33;
        expect(instance.data.b).toEqual(
            [23, {b: 33}]
        );

        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            expect(spySetData.calls[0].arguments[0]).toEqual(
                {'b[1].b': 33}
            );
            done();
        });
    });

    it('should update array when call push array api', function (done) {
        MyApp.use(observable);
        let spyPushData = spyOn(component, '$spliceData');
        let instance = MyComponent({
            data: {
                a: {a: 3, b: [23]},
                b: [23, {b: 56}]
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.didMount();
        let len = instance.a.b.push(56);
        assert(len === 2);

        len = instance.a.b.push(7);
        assert(len === 3);

        expect(instance.a).toEqual(
            {a: 3, b: [23, 56, 7]}
        );
        expect(instance.b).toEqual(
            [23, {b: 56}]
        );

        // expect(instance.data).toEqual({
        //     a: {a: 3, b: [23, 56]},
        //     b: [23, {b: 56}, 33, 56]
        // });

        setTimeout(() => {
            expect(spySetData).toNotHaveBeenCalled();
            assert(spyPushData.calls.length === 2);

            let args = spyPushData.calls[0].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{'a.b': [1, 0, 56]}]);

            args = spyPushData.calls[1].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{'a.b': [2, 0, 7]}]);

            done();
        });
    });

    it('should call nextTick array when call push array api', function (done) {
        MyApp.use(observable);
        let spyPushData = spyOn(component, '$spliceData').andCallThrough();
        let instance = MyComponent({
            data: {
                a: [12]
            }
        });

        let spySetData = createSpy((args, callback) => {
            /* eslint-disable max-nested-callbacks */
            setTimeout(() => callback(), 0);
        }).andCallThrough();
        instance.setData = spySetData;

        instance.didMount();
        instance.a.push(56);
        instance.a = [12];
        instance.a.push(3);

        let spyNextTick = createSpy(() => {}).andCallThrough();
        instance.$nextTick(spyNextTick);

        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            expect(spySetData.calls[0].arguments[0]).toEqual({a: [12]});
            assert(spySetData.calls.length === 1);

            assert(spyNextTick.calls.length === 1);

            assert(spyPushData.calls.length === 2);
            expect(spyPushData.calls[0].arguments.slice(0, 1)).toEqual([{a: [1, 0, 56]}]);
            expect(spyPushData.calls[1].arguments.slice(0, 1)).toEqual([{a: [1, 0, 3]}]);
            done();
        }, 10);
    });

    it('should pop array item when call pop api', function (done) {
        MyApp.use(observable);
        let spyPopData = spyOn(component, '$spliceData').andCallThrough();
        let instance = MyComponent({
            data: {
                a: {a: 3, b: [23]},
                b: [23, {b: 56}]
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.didMount();
        let item = instance.a.b.pop();
        assert(item === 23);
        item = instance.a.b.pop();
        assert(item === undefined);
        instance.b.pop();

        expect(instance.a).toEqual({a: 3, b: []});
        expect(instance.b).toEqual([23]);

        setTimeout(() => {
            expect(spySetData).toNotHaveBeenCalled();
            expect(spyPopData).toHaveBeenCalled();
            assert(spyPopData.calls.length === 2);

            let args = spyPopData.calls[0].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{'a.b': [0, 1]}]);

            args = spyPopData.calls[1].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{b: [1, 1]}]);

            done();
        });
    });

    it('should reverse array', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                a: [12, 56]
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.didMount();
        let result = instance.a.reverse();
        expect(result).toEqual([56, 12]);
        result = instance.a.reverse();
        expect(result).toEqual([12, 56]);

        expect(instance.data.a).toEqual([12, 56]);

        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            expect(spySetData.calls[0].arguments[0]).toEqual(
                {a: [12, 56]}
            );
            done();
        });
    });

    it('should sort array', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                a: [67, 12, 56]
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.didMount();
        let result = instance.a.sort();
        expect(result).toEqual([12, 56, 67]);
        result = instance.a.sort();
        expect(result).toEqual([12, 56, 67]);

        expect(instance.data.a).toEqual([12, 56, 67]);
        expect(instance.a).toEqual([12, 56, 67]);

        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            expect(spySetData.calls[0].arguments[0]).toEqual(
                {a: [12, 56, 67]}
            );

            done();
        });
    });

    it('should splice array', function (done) {
        MyApp.use(observable);
        let spySpliceData = spyOn(component, '$spliceData').andCallThrough();
        let instance = MyComponent({
            data: {
                a: [67, 12]
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.didMount();
        let result = instance.a.splice(1, 1, 23, 5);
        expect(result).toEqual([12]);
        result = instance.a.splice(0, 1);
        expect(result).toEqual([67]);

        result = instance.a.splice(0, 0, 7);
        expect(result).toEqual([]);
        expect(instance.a).toEqual([7, 23, 5]);

        setTimeout(() => {
            expect(spySetData).toNotHaveBeenCalled();
            assert(spySpliceData.calls.length === 3);

            let args = spySpliceData.calls[0].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{a: [1, 1, 23, 5]}]);

            args = spySpliceData.calls[1].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{a: [0, 1]}]);

            args = spySpliceData.calls[2].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{a: [0, 0, 7]}]);

            done();
        });
    });

    it('should shift array', function (done) {
        MyApp.use(observable);
        let spyShiftData = spyOn(component, '$spliceData').andCallThrough();
        let instance = MyComponent({
            data: {
                a: [67]
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.didMount();
        let result = instance.a.shift();
        expect(result).toEqual(67);

        result = instance.a.shift();
        expect(result).toEqual(undefined);

        expect(instance.a).toEqual([]);

        setTimeout(() => {
            expect(spySetData).toNotHaveBeenCalled();

            assert(spyShiftData.calls.length === 1);

            let args = spyShiftData.calls[0].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{a: [0, 1]}]);

            done();
        });
    });

    it('should unshift array', function (done) {
        MyApp.use(observable);
        let spyUnshiftData = spyOn(component, '$spliceData').andCallThrough();
        let instance = MyComponent({
            data: {
                a: [67]
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.didMount();
        let result = instance.a.unshift(5);
        expect(result).toEqual(2);

        result = instance.a.unshift(2);
        expect(result).toEqual(3);

        expect(instance.a).toEqual([2, 5, 67]);

        setTimeout(() => {
            expect(spySetData).toNotHaveBeenCalled();
            assert(spyUnshiftData.calls.length === 2);

            let args = spyUnshiftData.calls[0].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{a: [0, 0, 5]}]);

            args = spyUnshiftData.calls[1].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{a: [0, 0, 2]}]);

            done();
        });
    });
});
