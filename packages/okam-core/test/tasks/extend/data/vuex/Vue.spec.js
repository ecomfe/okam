/**
 * @file Vue fake test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

import assert from 'assert';
import expect, {createSpy} from 'expect';
import Vue from 'core/extend/data/vuex/Vue';

describe('Vue Fake', function () {

    it('Vue.set', function () {
        let target = {};
        Vue.set(target, 'a', 3);
        expect(target).toEqual({a: 3});

        Vue.set(target, 'a', 6);
        expect(target).toEqual({a: 6});

        target = [];
        Vue.set(target, 1, 2);
        /* eslint-disable no-sparse-arrays */
        expect(target).toEqual([, 2]);
        Vue.set(target, 0, 9);
        expect(target).toEqual([9, 2]);
    });

    it('Vue.delete', function () {
        let target = {};
        Vue.delete(target, 'a');
        expect(target).toEqual({});

        target = {b: {a: 3}, c: 3};
        Vue.delete(target, 'b');
        expect(target).toEqual({c: 3});

        target = [];
        Vue.delete(target, 1);
        expect(target).toEqual([]);

        target = [2, 3, 5];
        Vue.delete(target, 1);
        expect(target).toEqual([2, 5]);

        target = [39, 52];
        Vue.delete(target, '1');
        expect(target).toEqual([39]);
    });

    it('Vue.use', function () {
        let spyInstall = createSpy(() => {});
        let plugin = {
            install: spyInstall
        };

        Vue.use(plugin);
        assert(spyInstall.calls.length === 1);
        expect(spyInstall).toHaveBeenCalledWith(Vue);

        spyInstall = createSpy(() => {});
        plugin = spyInstall;
        Vue.use(plugin);
        assert(spyInstall.calls.length === 1);
        expect(spyInstall).toHaveBeenCalledWith(Vue);

        plugin = {};
        Vue.use(plugin);
        expect(plugin).toEqual({});
    });

    it('nextTick', function (done) {
        let spyCallback = createSpy(() => {});
        Vue.nextTick(spyCallback);

        expect(spyCallback).toNotHaveBeenCalled();
        setTimeout(() => {
            assert(spyCallback.calls.length === 1);
            expect(spyCallback).toHaveBeenCalled();
            done();
        }, 5);
    });

    it('Vue should have specified props', function () {
        assert(Vue.version === '2.5.1');
        expect(Vue.options).toEqual({});
        expect(Vue.config).toEqual({silent: true});
        assert(typeof Vue.mixin === 'function');
    });

    it('should return observable object', function () {
        let result = new Vue({
            data: {
                a: 3,
                arr: [],
                obj: {c: 2}
            },
            computed: {
                b() {
                    return this.a + 10;
                },
                c() {
                    return this.obj.c;
                },
                arrLen() {
                    return this.arr.length;
                }
            }
        });

        assert(result.a === 3);
        assert(result.b === 13);
        assert(result.c === 2);
        assert(result.arrLen === 0);

        result.a = 8;
        result.arr.push(2);
        result.arr.pop();
        result.arr.unshift(19);
        result.arr.shift();
        result.arr.push(12);
        result.arr.splice(0, 1, 8);
        result.arr.unshift(12);
        result.arr.reverse();
        expect(result.arr).toEqual([8, 12]);
        assert(result.a === 8);
        assert(result.b === 18);
        assert(result.arrLen === 2);

        result.obj.c = 8;
        assert(result.c === 8);
    });
});
