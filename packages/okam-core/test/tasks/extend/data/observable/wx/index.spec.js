/**
 * @file Observable data test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */
/* eslint-disable fecs-properties-quote */

import assert from 'assert';
import expect, {createSpy, spyOn} from 'expect';
import MyApp from 'core/App';
import MyPage from 'core/Page';
import {clearBaseCache} from 'core/helper/factory';
import {setObservableContext} from 'core/extend/data/observable';
import observable from 'core/extend/data/observable/wx';
import {fakeComponent, fakeAppEnvAPIs} from 'test/helper';

describe('observable', function () {
    let MyComponent;
    let restoreAppEnv;

    beforeEach('init global App', function () {
        clearBaseCache();

        MyComponent = fakeComponent();
        restoreAppEnv = fakeAppEnvAPIs('wx');
    });

    afterEach('clear global App', function () {
        MyComponent = undefined;
        restoreAppEnv();

        expect.restoreSpies();

        setObservableContext('data', false);
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

    it('should call $init before created', () => {
        let spyInit = spyOn(observable.component, '$init').andCallThrough();
        MyApp.use(observable);

        let props = {
            a: String,
            b: {
                type: Number,
                default: 10
            }
        };
        let component = MyComponent({
            props
        });
        expect(spyInit).toHaveBeenCalled();
        assert(typeof component.methods.$rawProps === 'function');
        assert(component.props === undefined);
        Object.keys(component.properties).forEach(k => {
            let value = component.properties[k];
            assert(typeof value.observer === 'function');
        });
    });

    it('should normalize component computed props', function () {
        MyApp.use(observable);
        let props = {
            a: String,
            b: {
                type: Number,
                default: 10
            }
        };
        let computedProps = {
            cc() {
                return this.a;
            }
        };
        let component = MyComponent({
            props,
            computed: computedProps
        });
        assert(typeof component.methods.$rawProps === 'function');
        assert(component.props === undefined);

        assert(typeof component.methods.$rawComputed === 'function');
        assert(component.computed === undefined);
        expect(component.$rawComputed()).toEqual(computedProps);

        Object.keys(component.properties).forEach(k => {
            let value = component.properties[k];
            assert(typeof value.observer === 'function');
        });
    });

    it('should normalize page computed props', function () {
        MyApp.use(observable);
        let props = {
            a: String,
            b: {
                type: Number,
                default: 10
            }
        };
        let computedProps = {
            cc() {
                return this.a;
            }
        };
        let page = MyPage({
            props,
            computed: computedProps
        });
        assert(typeof page.$rawProps === 'object');
        assert(page.props === props);

        assert(typeof page.$rawComputed === 'object');
        assert(page.computed === undefined);
        expect(page.$rawComputed).toEqual(computedProps);
    });

    it('should call observable plugin created hook', () => {
        let spyCreated = spyOn(observable.component, 'created').andCallThrough();
        MyApp.use(observable);

        let component = MyComponent({});
        expect(spyCreated).toNotHaveBeenCalled();

        component.created();
        expect(spyCreated).toHaveBeenCalled();
    });

    it('should call observable plugin detached hook', () => {
        let spyDetached = spyOn(observable.component, 'detached').andCallThrough();
        MyApp.use(observable);

        let component = MyComponent({});
        component.created();
        expect(spyDetached).toNotHaveBeenCalled();

        component.detached();
        expect(spyDetached).toHaveBeenCalled();
    });

    it('should call observable plugin created hook in page', () => {
        let spyCreated = spyOn(observable.component, 'created').andCallThrough();
        MyApp.use(observable);

        let page = MyPage({});
        expect(spyCreated).toNotHaveBeenCalled();

        page.onLoad();
        expect(spyCreated).toHaveBeenCalled();
    });

    it('should call afterObserverInit hook when created', () => {
        let spyAfterObserverInit = createSpy(() => {});
        MyApp.use(observable);

        let component = MyComponent({
            methods: {
                __afterObserverInit: spyAfterObserverInit
            }
        });

        component.created();
        expect(spyAfterObserverInit).toHaveBeenCalled();
        assert(spyAfterObserverInit.calls.length === 1);
    });

    it('should throw exception when data is not plain object', () => {
        MyApp.use(observable);
        let instance = MyComponent({});
        instance.created();

        instance = MyComponent({data: []});
        assert.throws(() => instance.created(), function (err) {
            return err.isTypeError;
        });
    });

    it('should make props observable', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            props: {
                a: String,
                b: {
                    type: Number,
                    default: 3
                },
                c: {
                    type: Array
                },
                d: Object
            },

            created() {
                assert(this.a === this.data.a);
                assert(this.b === this.data.b);

                expect(this.c).toEqual(this.data.c);
                expect(this.d).toEqual(this.data.d);
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        // fake prop data
        instance.data = {
            a: 'sss',
            b: 3,
            c: [23, {a: 3}],
            d: {a: 5, b: [12]}
        };

        instance.created();
        instance.b = 15;
        instance.a = 'aaa';
        instance.c.setItem(1, {a: 5});
        instance.d.a = 67;
        instance.d.b.push(66);
        expect(instance.data).toEqual({
            a: 'aaa',
            b: 15,
            c: [23, {a: 5}],
            d: {a: 67, b: [12, 66]}
        });
        assert(instance.b === 15);
        assert(instance.a === 'aaa');
        expect(instance.c[1]).toEqual({a: 5});
        expect(instance.d).toEqual({a: 67, b: [12, 66]});

        expect(spySetData).toNotHaveBeenCalled();
        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            expect(spySetData.calls[0].context).toBe(instance);
            expect(spySetData.calls[0].arguments[0]).toEqual({
                'b': 15,
                'a': 'aaa',
                'c[1]': {
                    a: 5
                },
                'd.a': 67,
                'd.b[1]': 66
            });
            done();
        });
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
        expect(instance.d).toEqual(instance.data.d);
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
                'e[1].b': 33,
                'd.b': [55, 23]
            });
            done();
        });
    });

    it('should only proxy prop data if has the same name in data', () => {
        MyApp.use(observable);
        let instance = MyComponent({
            props: [
                'a', 'c'
            ],
            data: {
                a: 3,
                b: true
            }
        });

        instance.created();
        let spyPropGet = spyOn(instance.__propsObserver, 'get').andCallThrough();
        let spyDataGet = spyOn(instance.__dataObserver, 'get').andCallThrough();
        let value = instance.a;
        assert(value === 3);
        expect(spyPropGet).toHaveBeenCalled();
        expect(spyDataGet).toNotHaveBeenCalled();
    });

    it('should throw exception when computed data has the same name in data', () => {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                a: 3,
                b: true
            },
            computed: {
                a() {
                    return this.b ? 5 : 6;
                }
            }
        });

        assert.throws(
            () => instance.created(),
            err => err.message.indexOf('Cannot redefine property') !== -1
        );
    });

    it('should throw exception when computed data has the same name in prop data', () => {
        MyApp.use(observable);
        let instance = MyComponent({
            props: {
                a: Number
            },
            computed: {
                a() {
                    return this.b ? 5 : 6;
                }
            }
        });

        assert.throws(
            () => instance.created(),
            err => err.message.indexOf('Cannot redefine property') !== -1
        );
    });

    it('should set computed data when created', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                b: {c: true, d: [23]},
                firstName: 'Jack',
                lastName: 'Lee'
            },

            computed: {
                len() {
                    return this.addFive(this.b.d.length);
                },
                fullName() {
                    return this.firstName + ' ' + this.lastName;
                }
            },

            created() {
                assert(this.len === 6);
                assert(this.fullName === 'Jack Lee');
            },
            methods: {
                addFive(num) {
                    return num + 5;
                }
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;
        instance.created();

        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            expect(spySetData.calls[0].arguments[0]).toEqual({len: 6, fullName: 'Jack Lee'});
            done();
        });
    });

    it('should observe computed data', function (done) {
        MyApp.use(observable);
        let now;
        let instance = MyComponent({
            data: {
                a: 3,
                b: {c: true, d: [23]},
                firstName: 'Jack',
                lastName: 'Lee'
            },

            computed: {
                len() {
                    return this.addFive(this.b.d.length);
                },
                noDep() {
                    return (now = Date.now());
                },
                fullName: {
                    get() {
                        return this.firstName + ' ' + this.lastName;
                    },
                    set(newValue) {
                        let names = newValue.split(' ');
                        this.firstName = names[0];
                        this.lastName = names[names.length - 1];
                    }
                },
                arrowFunc: vm => (vm.b.c ? 2 : 1)
            },

            created() {
                assert(this.len === 9);
                assert(now && this.noDep === now);
                assert(this.fullName === 'Jack Lee');
                assert(this.arrowFunc === 2);
            },
            methods: {
                addFive(num) {
                    return num + 5 + this.a;
                }
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;
        instance.created();
        let computed = instance.__computedObserver.computed;
        let spyLen = spyOn(computed.len, 'getter').andCallThrough();
        let spyNoDep = spyOn(computed.noDep, 'getter').andCallThrough();
        let spyFullNameGet = spyOn(computed.fullName, 'getter').andCallThrough();
        let spyFullNameSet = spyOn(computed.fullName, 'setter').andCallThrough();
        let spyArrowFunc = spyOn(computed.arrowFunc, 'getter').andCallThrough();

        instance.a = 0;
        instance.b.d.push(55);
        assert(instance.a === 0);
        assert(instance.data.a === 0);
        expect(instance.b.d).toEqual([23, 55]);
        expect(instance.data.b.d).toEqual([23, 55]);
        assert(instance.len === 7);
        assert(instance.arrowFunc === 2);

        setTimeout(() => {
            expect(spyLen).toHaveBeenCalled();
            expect(spyLen.calls.length === 1);
            expect(spyLen.calls[0].context).toBe(instance);
            expect(spyArrowFunc).toNotHaveBeenCalled();
            expect(spyNoDep).toNotHaveBeenCalled();
            expect(spyFullNameGet).toNotHaveBeenCalled();
            expect(spyFullNameSet).toNotHaveBeenCalled();

            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            let arg = Object.assign({}, spySetData.calls[0].arguments[0]);
            assert(typeof arg.noDep === 'number');
            delete arg.noDep;
            expect(arg).toEqual({
                len: 7,
                fullName: 'Jack Lee',
                arrowFunc: 2,
                a: 0,
                'b.d[1]': 55
            });

            instance.b.c = false;
            instance.a = 2;
            instance.fullName = 'Kate Lin';
            setTimeout(() => {
                expect(spyLen).toHaveBeenCalled();
                expect(spyLen.calls.length === 1);
                assert(instance.len === 9);

                expect(spyArrowFunc).toHaveBeenCalledWith(instance);
                assert(instance.arrowFunc === 1);

                expect(spyNoDep).toNotHaveBeenCalled();
                expect(spyFullNameGet).toHaveBeenCalled();
                expect(spyFullNameSet).toHaveBeenCalled();
                assert(instance.fullName === 'Kate Lin');
                assert(instance.firstName === 'Kate');
                assert(instance.lastName === 'Lin');
                assert(spySetData.calls.length === 2);
                expect(spySetData.calls[1].arguments[0]).toEqual({
                    'b.c': false,
                    arrowFunc: 1,
                    a: 2,
                    len: 9,
                    firstName: 'Kate',
                    fullName: 'Kate Lin',
                    lastName: 'Lin'
                });
            });
            done();
        });
    });

    it('should throw exception when computed prop no setter', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                a: 2
            },
            computed: {
                b() {
                    return this.a + 3;
                }
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        setTimeout(() => {
            assert.throws(
                () => (instance.b = 23),
                err => err.message.indexOf('has no setter') !== -1
            );
            done();
        });
    });

    it('should do nothing for data observer when call firePropChange', function () {
        MyApp.use(observable);
        let instance = MyComponent({
            props: {
                b: Number
            },
            data: {
                a: 2
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;
        instance.created();

        let spyNotifyWatcher = spyOn(instance.__dataObserver, 'notifyWatcher');
        instance.__dataObserver.firePropValueChange('b', 2, 3);
        expect(spyNotifyWatcher).toNotHaveBeenCalled();
    });

    it('should allow set property data key', function () {
        MyApp.use(observable);
        let instance = MyComponent({
            props: {
                b: Number
            }
        });

        instance.propsData = {
            b: 3
        };
        setObservableContext('propsData');
        let spySetData = createSpy(() => {});
        instance.setData = spySetData;
        instance.created();

        assert(instance.b === 3);
    });

    it('should update prop data when prop change', function (done) {
        MyApp.use(observable);
        let spyComputedB = createSpy(function () {
            return this.num + 3;
        }).andCallThrough();
        let spyObserver = createSpy(() => {});
        let instance = MyComponent({
            props: {
                num: {
                    type: Number,
                    default: 2
                },
                obj: {
                    type: Object,
                    observer: spyObserver
                }
            },
            data: {
                a: 2
            },
            computed: {
                b: spyComputedB,
                c() {
                    return this.obj && this.obj.c;
                }
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        instance.num = 12;
        instance.obj = {c: 3};

        assert(spyComputedB.calls.length === 2);
        setTimeout(() => {
            instance.properties.num.observer.call(instance, 12, 2, 'num');
            instance.properties.obj.observer.call(instance, {c: 3}, null, 'c');

            setTimeout(() => {
                expect(spyComputedB).toHaveBeenCalled();
                assert(spyComputedB.calls.length === 3);
                assert(instance.b === 15);

                expect(spyObserver).toHaveBeenCalled();
                assert(spyObserver.calls.length === 1);
                assert(instance.c === 3);

                done();
            });
        });
    });

    it('should not trigger update hook when no update task happen', function () {
        MyApp.use(observable);
        let spyUpdated = createSpy(() => {});
        let instance = MyComponent({
            updated: spyUpdated
        });
        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        instance.$notifySetDataDone();
        expect(spyUpdated).toNotHaveBeenCalled();
    });

    it('should not change when add new prop', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                a: {a: 3, b: [23]},
                b: [23, {b: 56}]
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        instance.c = 3;
        instance.a.c = 3;
        instance.b.getItem(1).c = 3;
        expect(instance.data).toEqual({
            a: {a: 3, b: [23]},
            b: [23, {b: 56}]
        });

        setTimeout(() => {
            expect(spySetData).toNotHaveBeenCalled();
            done();
        });
    });

    it('should call updated hook when update data done', function (done) {
        MyApp.use(observable);
        let callOrder = [];
        let spyUpdated = createSpy(() => {})
            .andCall(() => callOrder.push(3));
        let spyBeforeUpdate = createSpy(() => {})
            .andCall(() => callOrder.push(1));
        let instance = MyComponent({
            data: {
                a: 3,
                b: 'ss'
            },
            beforeUpdate: spyBeforeUpdate,
            updated: spyUpdated
        });

        let spySetData = createSpy((args, callback) => {
            callOrder.push(2);
            callback();
        }).andCallThrough();
        instance.setData = spySetData;

        instance.created();
        instance.a = 5;
        instance.b = 'aa';
        expect(spyUpdated).toNotHaveBeenCalled();
        expect(spyBeforeUpdate).toNotHaveBeenCalled();

        setTimeout(() => {
            expect(spyBeforeUpdate).toHaveBeenCalled();
            assert(spyBeforeUpdate.calls.length === 1);
            expect(spyBeforeUpdate.calls[0].context).toBe(instance);

            expect(spyUpdated).toHaveBeenCalled();
            assert(spyUpdated.calls.length === 1);
            expect(spyUpdated.calls[0].context).toBe(instance);

            assert(callOrder.join('') === '123');

            done();
        });
    });

    it('should not call setData when set same data', function (done) {
        MyApp.use(observable);
        let initObj = {};
        let instance = MyComponent({
            data: {
                a: 3,
                b: initObj
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        instance.a = 3;
        instance.b = initObj;
        setTimeout(() => {
            expect(spySetData).toNotHaveBeenCalled();

            instance.b = {};
            setTimeout(() => {
                expect(spySetData).toHaveBeenCalled();
                expect(spySetData.calls.length === 1);
                expect(spySetData.calls[0].arguments[0]).toEqual({b: {}});
            });
            done();
        });
    });

    it('should update using the new object data when set the new object', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                a: {b: 1}
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;
        instance.created();

        let a = instance.a;
        assert(instance.__dataObserver.observableData.a === a);

        let newA = {b: 1};
        instance.a = newA;
        assert(instance.__dataObserver.observableData.a === undefined);
        // assert(instance.a === instance.data.a);
        assert(instance.data.a === newA);
        let currA = instance.a;
        assert(currA === instance.__dataObserver.observableData.a);

        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            expect(spySetData.calls[0].arguments[0]).toEqual({a: {b: 1}});
            assert(spySetData.calls.length === 1);

            done();
        });
    });

    it('should support passing two args for $setData', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                a: {b: 1}
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        instance.$setData('a.b', 6);
        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            expect(spySetData.calls[0].arguments[0]).toEqual({'a.b': 6});
            done();
        });
    });

    it('should call nextTick callback when update data done', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                a: 2
            }
        });
        let spySetData = createSpy((args, callback) => {
            callback();
        }).andCallThrough();
        instance.setData = spySetData;

        instance.created();
        instance.$waitingDataUpQueues = null;

        let spyFunc1 = createSpy(() => {});
        instance.$nextTick(spyFunc1);

        instance.$waitingDataUpQueues = [];
        instance.a = 6;

        let spyFunc2 = createSpy(() => {});
        let spyFunc3 = createSpy(() => {});
        instance.$nextTick(spyFunc2);
        instance.$nextTick(spyFunc3);

        expect(spyFunc1).toNotHaveBeenCalled();
        expect(spyFunc2).toNotHaveBeenCalled();
        expect(spyFunc3).toNotHaveBeenCalled();

        setTimeout(() => {
            expect(spyFunc1).toNotHaveBeenCalled();
            expect(spyFunc2).toHaveBeenCalled();
            expect(spyFunc2.calls.length === 1);
            expect(spyFunc2.calls[0].context).toBe(instance);
            expect(spyFunc3).toHaveBeenCalled();

            done();
        });
    });

    it('should not update data when component destroy', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                a: 3
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        instance.a = 6;
        instance.detached();
        setTimeout(() => {
            expect(spySetData).toNotHaveBeenCalled();
            done();
        });
    });

    it('should not update data when component destroy after update data done', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                a: 3
            }
        });

        let spySetData = createSpy((arg, callback) => {
            setTimeout(() => {
                callback();
            }, 5);
        }).andCallThrough();
        instance.setData = spySetData;

        instance.created();
        instance.a = 6;

        let spyDone = createSpy(() => {});
        instance.$nextTick(spyDone);

        setTimeout(() => {
            instance.detached();
            expect(spySetData).toHaveBeenCalled();

            setTimeout(() => {
                expect(spyDone).toNotHaveBeenCalled();
                done();
            }, 5);
        });
    });

    it('should change the reference data value when assign to another property', function (done) {
        MyApp.use(observable);
        let instance = MyComponent({
            data: {
                a: {
                    b: 3
                },
                d: {}
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;
        instance.created();

        instance.d = instance.a;
        instance.d.b = 56;
        expect(instance.d).toEqual({b: 56});
        expect(instance.a).toEqual({b: 56});
        expect(instance.data).toEqual({
            a: {b: 56},
            d: {b: 56}
        });

        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            let args = spySetData.calls[0].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([
                {d: {b: 3}, 'a.b': 56, 'd.b': 56}
            ]);

            done();
        });
    });

});
