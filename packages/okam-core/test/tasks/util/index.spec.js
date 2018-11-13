/**
 * @file util test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable no-new-object */
/* eslint-disable fecs-use-method-definition */
import assert from 'assert';
import expect, {spyOn} from 'expect';
import {
    isPropertyWritable,
    isPromise,
    mixin,
    isFunction,
    isObject,
    isPlainObject,
    definePropertyValue
} from 'core/util/index';

describe('App', () => {
    afterEach(() => {
        expect.restoreSpies();
    });

    it('isPropertyWritable', () => {
        let obj = {};
        assert.ok(isPropertyWritable(obj, 'a'));

        Object.freeze(obj);
        assert.ok(!isPropertyWritable(obj, 'a'));

        obj = Object.seal({a: 3});
        assert.ok(isPropertyWritable(obj, 'a'));
        assert.ok(isPropertyWritable(obj, 'b'));

        obj = {};
        Object.defineProperties(obj, {
            a: {
                get() {
                    return 3;
                }
            },
            b: {
                get() {
                    return this._val;
                },
                set(val) {
                    this._val = val;
                }
            }
        });
        assert.ok(!isPropertyWritable(obj, 'a'));
        assert.ok(isPropertyWritable(obj, 'b'));
        assert.ok(isPropertyWritable(obj, 'c'));
    });

    it('definePropertyValue', () => {
        let obj = {a: 3};
        definePropertyValue(obj, 'b', 6);
        expect(obj).toEqual({a: 3, b: 6});

        definePropertyValue(obj, 'c', 5);
        expect(obj).toEqual({a: 3, b: 6, c: 5});
        Object.defineProperty(obj, 'd', {
            get() {
                return 8;
            }
        });
        Object.defineProperty(obj, 'e', {
            value: 10,
            enumerable: true
        });
        Object.defineProperty(obj, 'f', {});
        let obj2 = Object.create(obj);
        definePropertyValue(obj2, 'd', 9);
        definePropertyValue(obj2, 'e', 12);
        definePropertyValue(obj2, 'f', 66);

        assert(obj2.a === 3);
        assert(obj2.b === 6);
        assert(obj2.c === 5);
        assert(obj2.d === 9);
        assert(obj2.e === 12);
        assert(obj2.f === 66);
        expect(Object.keys(obj2)).toEqual(['d', 'e', 'f']);

        let fObj = Object.freeze({c: 's'});
        let fObj2 = Object.create(fObj);
        definePropertyValue(fObj2, 'c', 12);
        assert(fObj2.c === 12);

        let obj3 = {};
        let val = 8;
        Object.defineProperty(obj3, 'h', {
            get() {
                return val;
            },
            set(newVal) {
                val = newVal;
            }
        });
        definePropertyValue(obj3, 'h', 12);
        assert(obj3.h === 12);
        definePropertyValue(obj3, 'k', 6);
        assert(obj3.k === 6);
        definePropertyValue(obj3, 'k', 23);
        assert(obj3.k === 23);
    });

    it('isPromise', () => {
        let promise = new Promise(() => {});
        assert.ok(isPromise(promise));
        assert.ok(Promise.resolve(2));
        assert.ok(Promise.reject(23).catch(() => {}));

        assert.ok(!isPromise({}));
        assert.ok(!isPromise());
        let fakePromise = {
            then() {},
            catch() {}
        };
        assert.ok(isPromise(fakePromise));
    });

    it('mixin', () => {
        let obj = {a: 3, b: {c: 6, e: {b: 3}}, d: [23], h: null};
        let obj2 = {a: 56, b: {c: 78, d: 23, e: {a: 3}}, d: [56], e: 555, h: 666};
        let result = mixin(obj, obj2);
        assert(obj === result);
        expect(obj).toEqual({
            a: 3,
            b: {c: 6, d: 23, e: {b: 3}},
            d: [23],
            h: null,
            e: 555
        });

        obj = {a: 3, b: {c: 6, e: {b: 3}}, d: [23], h: null};
        obj2 = {a: 56, b: {c: 78, d: 23, e: {a: 3}}, d: [56], e: 555, h: 666, f: {a: 3}};
        let obj3 = {a: 32, e: {a: 3}, k: 56};
        result = mixin(obj, obj2, null, obj3);
        assert(obj === result);
        expect(obj).toEqual({
            a: 3,
            b: {c: 6, d: 23, e: {b: 3}},
            d: [23],
            h: null,
            e: 555,
            k: 56,
            f: {a: 3}
        });
        assert(obj.f !== obj2.f);

        obj = {a: () => {}, b: {c: () => {}}, c: () => {}};
        obj2 = {a: () => {}, b: {c: () => {}}};
        obj3 = {a: () => {}, c: () => {}};

        let originalBC = obj.b.c;
        let callOrder = [];
        let spyA = spyOn(obj, 'a').andCall(() => callOrder.push(3));
        let spyA2 = spyOn(obj2, 'a').andCall(() => callOrder.push(2));
        let spyA3 = spyOn(obj3, 'a').andCall(() => callOrder.push(1));

        result = mixin(obj, obj2, obj3);
        assert(result.b.c === originalBC);
        result.a();

        expect(spyA).toHaveBeenCalled();
        expect(spyA2).toHaveBeenCalled();
        expect(spyA3).toHaveBeenCalled();
        assert(callOrder.join('') === '123');
    });

    it('isFunction', () => {
        assert.ok(isFunction(() => {}));
        assert.ok(isFunction(function () {}));
        assert.ok(!isFunction());
        assert.ok(!isFunction({}));
    });

    it('isObject', () => {
        assert.ok(!isObject(() => {}));
        assert.ok(!isObject(function () {}));
        assert.ok(!isObject(2));
        assert.ok(!isObject(null));
        assert.ok(!isObject(NaN));
        assert.ok(!isObject(false));
        assert.ok(!isObject());
        assert.ok(!isObject(Number(2)));
        assert.ok(isObject(Promise.resolve(2)));
        assert.ok(isObject({}));
        assert.ok(isObject(new Object()));
        assert.ok(isObject(Object.create(null)));
    });

    it('isPlainObject', () => {
        assert.ok(!isPlainObject(Promise.resolve(2)));
        assert.ok(!isPlainObject(null));
        assert.ok(!isPlainObject(NaN));
        assert.ok(!isPlainObject());
        assert.ok(!isPlainObject(Number(2)));
        assert.ok(!isPlainObject(function () {}));
        assert.ok(!isPlainObject(() => {}));
        assert.ok(isPlainObject({}));
        assert.ok(isPlainObject(new Object()));
        assert.ok(isPlainObject(Object.create(null)));
    });
});
