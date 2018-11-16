/**
 * @file Data watch api test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */

import assert from 'assert';
import expect, {createSpy, spyOn} from 'expect';
import MyApp from 'core/App';
import MyPage from 'core/Page';
import {clearBaseCache} from 'core/helper/factory';
import observable from 'core/extend/data/observable/wx';
import watch from 'core/extend/data/watch';
import {fakeComponent, fakeAppEnvAPIs} from 'test/helper';

describe('data watch', function () {
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

    it('should call afterObserverInit', function () {
        let spyWatchInit = spyOn(
            watch.component.methods, '__afterObserverInit'
        ).andCallThrough();
        MyApp.use(observable);
        MyApp.use(watch);

        let component = MyComponent({});
        component.created();
        expect(spyWatchInit).toHaveBeenCalled();
        assert(spyWatchInit.calls.length === 1);
    });

    it('should normalize component watch props', function () {
        MyApp.use(observable);
        MyApp.use(watch);
        let watchProps = {
            c() {
                // do sth.
            }
        };
        let component = MyComponent({
            watch: watchProps,
            data: {
                c: 23
            }
        });

        assert(typeof component.methods.$rawWatch === 'function');
        assert(component.watch === undefined);
        expect(component.$rawWatch()).toEqual(watchProps);
    });

    it('should normalize page watch props', function (done) {
        let spyWatchInit = spyOn(
            watch.component.methods, '__afterObserverInit'
        ).andCallThrough();

        MyApp.use(observable);
        MyApp.use(watch);

        let spyWatchC = createSpy(() => {});
        let page = MyPage({
            data: {
                c: 'ss'
            },
            watch: {
                c: spyWatchC
            }
        });

        assert(typeof page.$rawWatch === 'object');
        assert(page.watch === undefined);
        expect(page.$rawWatch).toEqual({c: spyWatchC});

        page.onLoad();

        let spySetData = createSpy(() => {});
        page.setData = spySetData;

        page.c = 23;
        expect(spyWatchInit).toHaveBeenCalled();
        assert(spyWatchInit.calls.length === 1);

        setTimeout(() => {
            expect(spyWatchC).toHaveBeenCalled();
            assert(spyWatchC.calls.length === 1);
            expect(spySetData.calls[0].arguments[0]).toEqual({c: 23});
            done();
        });
    });

    it('should support watch config', function (done) {
        MyApp.use(observable);
        MyApp.use(watch);

        let spyWatchA = createSpy(function () {}).andCallThrough();
        let spyWatchBc = createSpy(function () {});
        let spyValueChange = createSpy(function () {});
        let spyBeHandler1 = createSpy(function () {});
        let spyBeHandler2 = createSpy(function () {});
        let spyWatchFHandler = createSpy(function () {});

        let component = MyComponent({
            data: {
                a: 3,
                b: {
                    c: [23],
                    d: 'str',
                    e: true
                },
                f: {}
            },
            watch: {
                'a': spyWatchA,
                'b.c': spyWatchBc,
                'b.d': 'valueChange',
                'b.e': [
                    spyBeHandler1,
                    spyBeHandler2
                ],
                'f': {
                    handler: spyWatchFHandler
                }
            },

            methods: {
                valueChange: spyValueChange
            }
        });

        let spySetData = createSpy(() => {});
        component.setData = spySetData;
        component.created();

        component.a = 5;
        component.b.c.push(44);
        component.b.d = 'efg';
        component.b.e = false;
        component.f = {a: 3};

        setTimeout(() => {
            expect(spyWatchA).toHaveBeenCalledWith(5, 3);
            expect(spyWatchA.calls[0].context).toBe(component);
            assert(spyWatchA.calls.length === 1);

            expect(spyWatchBc).toHaveBeenCalled();
            assert(spyWatchBc.calls.length === 1);
            expect(spyWatchBc.calls[0].arguments).toEqual([component.b.c, component.b.c]);

            expect(spyValueChange).toHaveBeenCalledWith('efg', 'str');
            expect(spyValueChange.calls[0].context).toBe(component);
            assert(spyValueChange.calls.length === 1);

            expect(spyBeHandler1).toHaveBeenCalledWith(false, true);
            expect(spyBeHandler1.calls[0].context).toBe(component);
            assert(spyBeHandler1.calls.length === 1);
            expect(spyBeHandler2).toHaveBeenCalledWith(false, true);
            assert(spyBeHandler2.calls.length === 1);
            expect(spyBeHandler2.calls[0].context).toBe(component);

            expect(spyWatchFHandler).toHaveBeenCalledWith({a: 3}, {});
            expect(spyWatchFHandler.calls[0].context).toBe(component);
            assert(spyWatchFHandler.calls.length === 1);

            done();
        });
    });

    it('should call it immediately when set immediate true', function (done) {
        MyApp.use(observable);
        MyApp.use(watch);

        let spyWatch = createSpy(function () {}).andCallThrough();
        let component = MyComponent({
            data: {
                a: {
                    b: 5
                }
            },
            watch: {
                'a.b': {
                    handler: spyWatch,
                    immediate: true
                }
            },
            methods: {
            }
        });

        let spySetData = createSpy(() => {});
        component.setData = spySetData;
        component.created();

        expect(spyWatch).toHaveBeenCalledWith(5);
        expect(spyWatch.calls[0].context).toBe(component);
        assert(spyWatch.calls.length === 1);

        done();
    });

    it('should watch deep when set deep true', function (done) {
        MyApp.use(observable);
        MyApp.use(watch);

        let spyWatchA = createSpy(function () {});
        let spyWatchAb = createSpy(function () {});
        let component = MyComponent({
            data: {
                a: {
                    b: {
                        c: 2,
                        arr: [
                            {
                                n: 'ss'
                            }
                        ]
                    }
                }
            },
            watch: {
                'a': spyWatchA,
                'a.b': {
                    deep: true,
                    handler: spyWatchAb
                }
            },
            methods: {
            }
        });

        let spySetData = createSpy(() => {});
        component.setData = spySetData;
        component.created();

        component.a.b.arr.getItem(0).n = 'kk';

        setTimeout(() => {
            expect(spyWatchA).toNotHaveBeenCalled();
            expect(spyWatchAb).toHaveBeenCalledWith(
                {c: 2, arr: [{n: 'kk'}]},
                {c: 2, arr: [{n: 'kk'}]}
            );
            assert(spyWatchAb.calls.length === 1);

            done();
        });
    });

    it('should call watch handler one time when data change multiple times', function (done) {
        MyApp.use(observable);
        MyApp.use(watch);

        let spyWatchA = createSpy(function () {});
        let spyWatchB = createSpy(function () {});
        let component = MyComponent({
            data: {
                a: 2,
                b: 3
            },
            watch: {
                'a': spyWatchA,
                'b': spyWatchB
            },
            methods: {
            }
        });

        let spySetData = createSpy(() => {});
        component.setData = spySetData;
        component.created();

        component.a = 'ss';
        component.a = 'ss';
        component.a = '66';

        component.b = 12;
        component.b = 3;

        setTimeout(() => {
            expect(spyWatchA).toHaveBeenCalled();
            assert(spyWatchA.calls.length === 1);
            expect(spyWatchA.calls[0].arguments).toEqual(['66', 2]);

            expect(spyWatchB).toHaveBeenCalled();
            assert(spyWatchB.calls.length === 1);
            expect(spyWatchB.calls[0].arguments).toEqual([3, 3]);

            done();
        });
    });

    it('should watch computed props', function (done) {
        MyApp.use(observable);
        MyApp.use(watch);

        let spyWatchArrLen = createSpy(function () {});
        let spyWatchAPlus = createSpy(function () {});
        let spyWatchArrCopy = createSpy(function () {});
        let spyWatchA = createSpy(function () {});
        let component = MyComponent({
            data: {
                a: 1,
                arr: [23],
                obj: {
                    arr: [
                        {name: 'a'}
                    ]
                }
            },
            watch: {
                'arrLen': spyWatchArrLen,
                'objArrCopy': spyWatchArrCopy,
                'aPlus': spyWatchAPlus,
                'a': spyWatchA
            },

            computed: {
                arrLen() {
                    return this.arr.length;
                },
                objArrCopy() {
                    return this.obj.arr.map(item => item.name);
                },
                aPlus: {
                    get() {
                        return this.a + 1;
                    },
                    set(v) {
                        this.a = v - 1;
                    }
                }
            },
            methods: {
            }
        });

        let spySetData = createSpy(() => {});
        component.setData = spySetData;
        component.created();

        component.arr.push(23);
        component.arr.shift();

        component.obj.arr.unshift({name: 'b'});
        component.aPlus = 10;

        setTimeout(() => {
            expect(spyWatchArrLen).toHaveBeenCalledWith(1, 1);
            assert(spyWatchArrLen.calls.length === 1);

            expect(spyWatchArrCopy).toHaveBeenCalledWith(['b', 'a'], ['a']);
            assert(spyWatchArrCopy.calls.length === 1);

            expect(spyWatchA).toHaveBeenCalledWith(9, 1);
            assert(spyWatchA.calls.length === 1);

            expect(spyWatchAPlus).toHaveBeenCalledWith(10, 2);
            assert(spyWatchAPlus.calls.length === 1);

            done();
        });
    });

    it('should watch prop change', function (done) {
        MyApp.use(observable);
        MyApp.use(watch);

        let spyWatchProp = createSpy(function () {});
        let spyWatchMyNum = createSpy(function () {});
        let component = MyComponent({
            props: {
                num: Number
            },
            data: {
                a: 1
            },
            computed: {
                myNum() {
                    return this.num == null ? 0 : this.num + 2;
                }
            },
            watch: {
                'num': spyWatchProp,
                'myNum': spyWatchMyNum
            }
        });

        let spySetData = createSpy(() => {});
        component.setData = spySetData;
        component.created();

        setTimeout(() => {
            assert(spySetData.calls.length === 1);
            component.num = 12;
            component.properties.num.observer.call(component, 12, 2, 'num');

            setTimeout(() => {
                expect(spyWatchProp).toHaveBeenCalledWith(12, undefined);
                assert(spyWatchProp.calls.length === 1);

                expect(spyWatchMyNum).toHaveBeenCalledWith(14, 0);
                assert(spyWatchMyNum.calls.length === 1);

                done();
            });
        });
    });

    it('should support $watch api', function (done) {
        MyApp.use(observable);
        MyApp.use(watch);

        let spyWatchA = createSpy(function () {});
        let spyWatchA2 = createSpy(function () {});
        let spyWatchB = createSpy(function () {});
        let spyWatchDeepB = createSpy(function () {});
        let spyWatchBc = createSpy(function () {});
        let spyWatchArr = createSpy(function () {});
        let spyWatcher = createSpy(function () {
            return this.c;
        }).andCallThrough();
        let spyCustomWatch = createSpy(function () {});
        let component = MyComponent({
            data: {
                a: 2,
                b: {
                    c: 3,
                    d: {
                        k: 23
                    }
                },
                c: {
                    s: 'a'
                },
                arr: [12]
            },
            watch: {
                'a': spyWatchA
            },

            created() {
                this.$watch('a', spyWatchA2);
                this.$watch('b', spyWatchB);
                this.$watch('b', spyWatchDeepB, {deep: true});
                this.$watch('b.c', spyWatchBc);
                this.$watch('arr', spyWatchArr, {immediate: true});
                this.$watch(spyWatcher, spyCustomWatch, {deep: true, immediate: true});
            },

            methods: {

            }
        });

        let spySetData = createSpy(() => {});
        component.setData = spySetData;
        component.created();

        expect(spyWatchArr).toHaveBeenCalledWith([12]);
        expect(spyWatchArr.calls[0].context).toBe(component);
        assert(spyWatchArr.calls.length === 1);

        expect(spyWatcher).toHaveBeenCalled();
        assert(spyWatcher.calls.length === 2);
        expect(spyWatcher.calls[0].context).toBe(component);

        expect(spyCustomWatch).toHaveBeenCalledWith({s: 'a'});
        expect(spyCustomWatch.calls[0].context).toBe(component);
        assert(spyCustomWatch.calls.length === 1);

        component.a = 3;
        component.a = 10;

        component.b.d.k = 53;
        // component.b = {k: 555};

        component.arr.pop();

        component.c.s = 'b';

        setTimeout(() => {
            expect(spyWatchA).toHaveBeenCalledWith(10, 2);
            assert(spyWatchA.calls.length === 1);

            expect(spyWatchA2).toHaveBeenCalledWith(10, 2);
            expect(spyWatchA2.calls[0].context).toBe(component);
            assert(spyWatchA2.calls.length === 1);

            expect(spyWatchB).toNotHaveBeenCalled();
            expect(spyWatchBc).toNotHaveBeenCalled();

            expect(spyWatchDeepB).toHaveBeenCalledWith(
                {c: 3, d: {k: 53}}, {c: 3, d: {k: 53}}
            );
            expect(spyWatchDeepB.calls[0].context).toBe(component);
            assert(spyWatchDeepB.calls.length === 1);

            assert(spyWatchArr.calls.length === 2);
            expect(spyWatchArr.calls[1].arguments).toEqual(
                [[], []]
            );

            assert(spyWatcher.calls.length === 3);
            assert(spyCustomWatch.calls.length === 2);
            expect(spyCustomWatch.calls[1].arguments).toEqual(
                [{s: 'b'}, {s: 'b'}]
            );
            done();
        });
    });

    it('should call watchers when the object change', function (done) {
        MyApp.use(observable);
        MyApp.use(watch);

        let spyWatchK = createSpy(function () {});
        let spyWatchB = createSpy(function () {});
        let spyWatchDeepB = createSpy(function () {});
        let component = MyComponent({
            data: {
                b: {
                    c: 3,
                    d: {
                        k: 23
                    }
                }
            },
            created() {
                this.$watch('b', spyWatchB);
                this.$watch('b', spyWatchDeepB, {deep: true});
                this.$watch('b.d.k', spyWatchK);
            }
        });

        let spySetData = createSpy(() => {});
        component.setData = spySetData;
        component.created();

        component.b = {k: 5};

        setTimeout(() => {
            expect(spyWatchB).toHaveBeenCalledWith({k: 5}, {c: 3, d: {k: 23}});
            assert(spyWatchB.calls.length === 1);

            expect(spyWatchDeepB).toHaveBeenCalledWith({k: 5}, {c: 3, d: {k: 23}});
            assert(spyWatchDeepB.calls.length === 1);

            expect(spyWatchK).toHaveBeenCalledWith(undefined, 23);
            assert(spyWatchK.calls.length === 1);

            done();
        });
    });

    it('should remove watcher when call remove watch api', function (done) {
        MyApp.use(observable);
        MyApp.use(watch);

        let spyWatch = createSpy(function () {});
        let component = MyComponent({
            data: {
                b: 2
            },
            created() {
                this.bWatcher = this.$watch('b', spyWatch);
            }
        });

        let spySetData = createSpy(() => {});
        component.setData = spySetData;
        component.created();

        component.b = 23;

        setTimeout(() => {
            expect(spyWatch).toHaveBeenCalled();
            assert(spyWatch.calls.length === 1);

            component.bWatcher();
            component.b = 777;

            setTimeout(() => {
                assert(spyWatch.calls.length === 1);
                done();
            });
        });
    });

    it('should not call watch handlers when dispose', function (done) {
        MyApp.use(observable);
        MyApp.use(watch);

        let spyWatch = createSpy(function () {});
        let component = MyComponent({
            data: {
                b: 2
            },
            watch: {
                b: spyWatch
            }
        });

        let spySetData = createSpy(() => {});
        component.setData = spySetData;
        component.created();

        component.b = 23;
        component.detached();

        setTimeout(() => {
            expect(spyWatch).toNotHaveBeenCalled();
            done();
        });
    });

});
