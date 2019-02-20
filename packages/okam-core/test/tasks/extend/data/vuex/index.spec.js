/**
 * @file Vuex support test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */
/* eslint-disable fecs-properties-quote */

import assert from 'assert';
import expect, {createSpy} from 'expect';
import MyApp from 'core/swan/App';
import MyPage from 'core/swan/Page';
import * as na from 'core/na/index';
import {clearBaseCache} from 'core/helper/factory';
import vuexPlugin from 'core/extend/data/vuex/index';
import observable from 'core/extend/data/observable';
import store from './store/simpleStore';
import store2 from './store/store2';
import store3 from './store/store3';
import store4 from './store/store4';
import store5 from './store/store5';
import store6 from './store/store6';
import Vuex, {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import {executeSequentially, fakeComponent, fakeAppEnvAPIs} from 'test/helper';

describe('Vuex support', function () {
    let restoreAppEnv;
    let rawGetCurrApp;
    let MyComponent;
    beforeEach('init global App', function () {
        clearBaseCache();

        MyComponent = fakeComponent();
        restoreAppEnv = fakeAppEnvAPIs('swan');
        MyApp.use(observable);
        MyApp.use(vuexPlugin);

        rawGetCurrApp = na.getCurrApp;
    });

    afterEach('clear global App', function () {
        restoreAppEnv();
        MyComponent = undefined;
        na.getCurrApp = rawGetCurrApp;
        expect.restoreSpies();
    });

    it('should support using vuex manage data for page', function (done) {
        na.getCurrApp = function () {
            return {
                $store: store
            };
        };

        let page = MyPage({
            data: {
                num: 1
            },

            computed: {
                count() {
                    return store.state.count;
                },
                a() {
                    return store.state.obj.a;
                },
                arrLen() {
                    return store.state.arr.length;
                },
                myArr() {
                    return store.state.arr;
                },
                ...mapState({
                    // arrow functions can make the code very succinct!
                    count2: state => (state.count + 10),

                    // passing the string value 'count' is the same as `state => state.count`
                    countAlias: 'count',

                    count3(state) {
                        return this.countPlusLocalState + state.count;
                    },

                    // to access local state with `this`, a normal function must be used
                    countPlusLocalState(state) {
                        return state.count + this.num;
                    }
                })
            },

            methods: {
                decrement() {
                    store.commit('decrement');
                },

                ...mapMutations({
                    add: 'increment',
                    changeObj: 'changeObj',
                    upArr: 'upArr'
                }),
                ...mapActions([
                    'addTwiceAction'
                ])
            },

            created() {
                let state = this.$store.state;
                expect(state).toEqual({
                    count: 0, obj: {a: 1}, arr: []
                });
            }
        });

        let spySetData = createSpy(() => {});
        page.setData = spySetData;

        page.onLoad();

        assert(page.count === 0);
        assert(page.count2 === 10);
        assert(page.count3 === 1);
        assert(page.a === 1);
        assert(page.arrLen === 0);
        assert(page.countAlias === page.count);
        assert(page.countPlusLocalState === 1);
        expect(page.myArr).toEqual([]);

        let task1 = () => {
            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            let args = spySetData.calls[0].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{
                a: 1,
                arrLen: 0,
                myArr: [],
                count: 0,
                count2: 10,
                count3: 1,
                countAlias: 0,
                countPlusLocalState: 1
            }]);

            page.add();
            page.add();
            page.decrement();
            page.add();
            page.changeObj();
            page.upArr();

            assert(page.count === 2);
            assert(page.count2 === 12);
            assert(page.count3 === 5);
            assert(page.countAlias === page.count);
            assert(page.countPlusLocalState === 3);
            assert(page.a === 2);
            assert(page.arrLen === 1);
            expect(page.myArr).toEqual([2]);
            expect(page.$store.state).toEqual({
                count: 2, obj: {a: 2}, arr: [2]
            });
        };
        let task2 = () => {
            assert(spySetData.calls.length === 2);
            let args = spySetData.calls[1].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{
                count: 2,
                count2: 12,
                count3: 5,
                countAlias: 2,
                countPlusLocalState: 3,
                a: 2,
                arrLen: 1,
                myArr: [2]
            }]);

            page.num = 10;
            assert(page.count === 2);
            assert(page.count2 === 12);
            assert(page.count3 === 14);
            assert(page.countAlias === page.count);
            assert(page.countPlusLocalState === 12);
        };
        let task3 = () => {
            assert(spySetData.calls.length === 3);
            let args = spySetData.calls[2].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{
                num: 10,
                countPlusLocalState: 12,
                count3: 14
            }]);

            page.addTwiceAction();
        };

        let task4 = () => {
            assert(page.count === 4);
            assert(page.count2 === 14);
            assert(page.count3 === 18);
            assert(page.countAlias === page.count);
            assert(page.countPlusLocalState === 14);

            assert(spySetData.calls.length === 5);
            let args = spySetData.calls[3].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{
                count: 3,
                count2: 13,
                countAlias: 3,
                count3: 16,
                countPlusLocalState: 13
            }]);

            args = spySetData.calls[4].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{
                count: 4,
                count2: 14,
                countAlias: 4,
                count3: 18,
                countPlusLocalState: 14
            }]);

            done();
        };
        task4.delay = 10;

        executeSequentially([
            task1, task2, task3, task4
        ], 1);
    });

    it('should support using vuex manage data for component', function (done) {
        na.getCurrApp = function () {
            return {
                $store: store2
            };
        };

        let instance = MyComponent({
            computed: {
                count() {
                    return this.$store.state.count;
                },
                ...mapGetters([
                    'evenOrOdd'
                ])
            },
            mounted() {
                let state = this.$store.state;
                expect(state).toEqual({count: 0});
            },
            methods: {
                ...mapActions([
                    'increment',
                    'decrement',
                    'incrementIfOdd',
                    'incrementAsync'
                ])
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        instance.attached();
        instance.ready();

        assert(instance.count === 0);
        assert(instance.evenOrOdd === 'even');

        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            let args = spySetData.calls[0].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{
                count: 0, evenOrOdd: 'even'
            }]);

            instance.incrementIfOdd();
            instance.increment();
            instance.decrement();
            instance.increment();
            assert(instance.count === 1);
            assert(instance.evenOrOdd === 'odd');

            instance.incrementIfOdd();
            assert(instance.count === 2);
            assert(instance.evenOrOdd === 'even');

            expect(instance.$store.state).toEqual({count: 2});

            instance.incrementAsync();
            setTimeout(() => {
                assert(spySetData.calls.length === 3);

                args = spySetData.calls[1].arguments;
                expect(args.slice(0, args.length - 1)).toEqual([{
                    count: 2,
                    evenOrOdd: 'even'
                }]);

                args = spySetData.calls[2].arguments;
                expect(args.slice(0, args.length - 1)).toEqual([{
                    count: 3,
                    evenOrOdd: 'odd'
                }]);
                assert(instance.count === 3);
                assert(instance.evenOrOdd === 'odd');

                na.getCurrApp = rawGetCurrApp;
                done();
            }, 10);
        });

    });

    it('should support vuex module', function (done) {
        na.getCurrApp = function () {
            return {
                $store: store3
            };
        };

        let instance = MyComponent({
            computed: {
                count() {
                    return this.$store.state.count;
                },
                ...mapGetters({
                    'evenOrOdd': 'evenOrOdd',
                    moduleEventOrOdd: 'evenOrOdd2',
                    a: 'a'
                })
            },
            mounted() {
                let state = this.$store.state;
                expect(state).toEqual({
                    count: 0,
                    countModule: {
                        count: -99,
                        obj: {
                            a: 2
                        }
                    }
                });
            },
            methods: {
                ...mapActions([
                    'increment'
                ]),
                ...mapMutations([
                    'add'
                ])
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        instance.attached();
        instance.ready();

        assert(instance.count === 0);
        assert(instance.evenOrOdd === 'even');
        assert(instance.moduleEventOrOdd === 'odd');
        assert(instance.a === 2);

        instance.increment();
        instance.add();

        assert(instance.count === 1);
        assert(instance.evenOrOdd === 'odd');
        assert(instance.moduleEventOrOdd === 'odd');
        assert(instance.a === 3);

        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            let args = spySetData.calls[0].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{
                count: 1,
                a: 3,
                evenOrOdd: 'odd',
                moduleEventOrOdd: 'odd'
            }]);

            done();
        });
    });

    it('should support namespaced vuex module', function (done) {
        na.getCurrApp = function () {
            return {
                $store: store4
            };
        };

        let instance = MyComponent({
            computed: {
                count() {
                    return this.$store.state.count;
                },
                ...mapState('countModule', {
                    moduleCount: state => state.count
                }),
                ...mapGetters(['evenOrOdd']),
                ...mapGetters('countModule', {
                    'moduleEvenOrOdd': 'evenOrOdd',
                    a: 'a'
                })
            },
            mounted() {
                let state = this.$store.state;
                expect(state).toEqual({
                    count: 0,
                    countModule: {
                        count: -99,
                        obj: {
                            a: 2
                        }
                    }
                });
            },
            methods: {
                ...mapActions([
                    'increment'
                ]),
                ...mapMutations('countModule', {
                    addObjA: 'add',
                    'moduleAdd': 'increment'
                })
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        instance.attached();
        instance.ready();

        assert(instance.count === 0);
        assert(instance.moduleCount === -99);
        assert(instance.evenOrOdd === 'even');
        assert(instance.moduleEvenOrOdd === 'odd');
        assert(instance.a === 2);

        instance.increment();
        instance.addObjA();
        instance.moduleAdd();

        assert(instance.count === 1);
        assert(instance.moduleCount === -98);
        assert(instance.evenOrOdd === 'odd');
        assert(instance.moduleEvenOrOdd === 'even');
        assert(instance.a === 3);

        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            let args = spySetData.calls[0].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{
                count: 1,
                moduleCount: -98,
                a: 3,
                evenOrOdd: 'odd',
                moduleEvenOrOdd: 'even'
            }]);

            done();
        });
    });

    it('should support dynamically add vuex module', function (done) {
        na.getCurrApp = function () {
            return {
                $store: store5
            };
        };

        let instance = MyComponent({
            computed: {
                count() {
                    let state = this.$store.state;
                    let dynamicModule = state.dynamicModule;
                    return state.count + (dynamicModule ? dynamicModule.num : 0);
                }
            },
            mounted() {
                let state = this.$store.state;
                expect(state).toEqual({
                    count: 0,
                    countModule: {
                        count: -99,
                        obj: {
                            a: 2
                        }
                    }
                });
            },
            methods: {
                ...mapActions([
                    'increment'
                ]),
                addModule() {
                    this.$store.registerModule('dynamicModule', {
                        namespaced: true,
                        state: {
                            num: 2
                        },
                        mutations: {
                            addNum: state => state.num++
                        }
                    });
                },
                changeDynamicModuleState() {
                    this.$store.commit('dynamicModule/addNum');
                }
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        instance.attached();
        instance.ready();

        assert(instance.count === 0);

        instance.addModule();
        instance.changeDynamicModuleState();
        instance.$fireStoreChange();

        expect(instance.$store.state).toEqual({
            count: 0,
            countModule: {count: -99, obj: {a: 2}},
            dynamicModule: {num: 3}
        });

        instance.changeDynamicModuleState();

        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            let args = spySetData.calls[0].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{
                count: 4
            }]);

            done();
        });
    });

    it('should remove store watcher when page hide or destroyed', function () {
        na.getCurrApp = function () {
            return {
                $store: store6
            };
        };

        let spyHide = createSpy(() => {});
        let spyShow = createSpy(() => {});
        let instance = MyPage({
            computed: {
                count() {
                    return this.$store.state.count;
                }
            },
            onHide: spyHide,
            onShow: spyShow,
            methods: {
                ...mapActions([
                    'increment'
                ])
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.onLoad();

        assert(instance.count === 0);
        assert(typeof instance.__unsubscribeStore === 'function');

        let spyUnsubscribe = createSpy(() => {});
        instance.__unsubscribeStore = spyUnsubscribe;

        instance.onHide();
        expect(spyHide).toHaveBeenCalled();
        assert(spyHide.calls.length === 1);
        assert(instance.__unsubscribeStore === null);
        expect(spyUnsubscribe).toHaveBeenCalled();

        instance.$unsubscribeStoreChange();
        assert(spyUnsubscribe.calls.length === 1);
        assert(instance.__unsubscribeStore === null);

        instance.onShow();
        expect(spyShow).toHaveBeenCalled();
        assert(spyShow.calls.length === 1);
        let unsubscribeHandler = instance.__unsubscribeStore;
        assert(typeof unsubscribeHandler === 'function');

        instance.$subscribeStoreChange();
        assert(instance.__unsubscribeStore === unsubscribeHandler);

        spyUnsubscribe = createSpy(() => {});
        instance.__unsubscribeStore = spyUnsubscribe;

        instance.detached();

        assert(instance.__unsubscribeStore === null);
        assert(instance.$store === null);
        expect(spyUnsubscribe).toHaveBeenCalled();
    });

    it('$unsubscribeStoreChange/$subscribeStoreChange', function () {
        na.getCurrApp = function () {
            return {
                $store: store6
            };
        };

        let instance = MyPage({
            computed: {
                count() {
                    return this.$store.state.count;
                }
            },
            methods: {
                ...mapActions([
                    'increment'
                ])
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.onLoad();

        assert(instance.count === 0);
        assert(typeof instance.__unsubscribeStore === 'function');

        instance.$unsubscribeStoreChange();
        assert(instance.__unsubscribeStore === null);

        instance.$subscribeStoreChange();
        assert(typeof instance.__unsubscribeStore === 'function');
    });

    it('should remove store watcher when component hide or destroyed', function () {
        na.getCurrApp = function () {
            return {
                $store: store6
            };
        };

        // let spyHide = createSpy(() => {});
        // let spyShow = createSpy(() => {});
        let instance = MyComponent({
            computed: {
                count() {
                    return this.$store.state.count;
                }
            },
            // pageLifetimes: {
            //     show: spyShow,
            //     hide: spyHide
            // },
            methods: {
                ...mapActions([
                    'increment'
                ])
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        instance.attached();
        instance.ready();

        assert(instance.onShow === undefined);
        assert(instance.onHide === undefined);
        // assert(instance.pageLifetimes.show === spyShow);
        // assert(instance.pageLifetimes.hide === spyHide);

        assert(instance.count === 0);
        assert(typeof instance.__unsubscribeStore === 'function');

        let spyUnsubscribe = createSpy(() => {});
        instance.__unsubscribeStore = spyUnsubscribe;

        instance.pageLifetimes.hide.call(instance);
        assert(instance.__unsubscribeStore === null);
        expect(spyUnsubscribe).toHaveBeenCalled();

        instance.pageLifetimes.show.call(instance);
        assert(typeof instance.__unsubscribeStore === 'function');

        spyUnsubscribe = createSpy(() => {});
        instance.__unsubscribeStore = spyUnsubscribe;

        instance.detached();

        assert(instance.__unsubscribeStore === null);
        assert(instance.$store === null);
        expect(spyUnsubscribe).toHaveBeenCalled();
    });

    it('should do nothing when none computed props', function () {
        na.getCurrApp = function () {
            return {
                $store: new Vuex.Store({
                    state: {
                        count: 0
                    }
                })
            };
        };

        let instance = MyComponent({data: {count: 10}});

        instance.created();
        instance.attached();
        instance.ready();

        assert(instance.count === 10);
        assert(!!instance.$store);
        assert(instance.__unsubscribeStore === undefined);

        instance.$unsubscribeStoreChange();
        assert(instance.__unsubscribeStore === undefined);

        instance.$subscribeStoreChange();
        assert(instance.__unsubscribeStore === undefined);

        instance.$fireStoreChange();
        assert(instance.count === 10);

        instance.detached();

        assert(instance.__unsubscribeStore === undefined);
        assert(instance.$store === null);
    });

    it('should support $store function', function () {
        na.getCurrApp = function () {
            return {
                $store: () => store6
            };
        };

        let instance = MyComponent({
            computed: {
                count() {
                    return this.$store.state.count;
                }
            },
            methods: {
                ...mapActions([
                    'increment'
                ])
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        instance.attached();
        instance.ready();

        assert(typeof instance.count === 'number');
    });
});
