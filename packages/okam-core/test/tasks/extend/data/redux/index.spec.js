/**
 * @file Redux support test spec
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
import reduxPlugin from 'core/extend/data/redux/index';
import observable from 'core/extend/data/observable';
import store from './store/index';
import {fakeAppEnvAPIs, fakeComponent} from 'test/helper';

describe('Redux support', function () {
    let restoreAppEnv;
    let MyComponent;
    let rawGetCurrApp;
    beforeEach('init global App', function () {
        clearBaseCache();
        MyComponent = fakeComponent();
        restoreAppEnv = fakeAppEnvAPIs('swan');
        rawGetCurrApp = na.getCurrApp;

        MyApp.use(observable);
        MyApp.use(reduxPlugin);
    });

    afterEach('clear global App', function () {
        restoreAppEnv();
        MyComponent = null;
        na.getCurrApp = rawGetCurrApp;
        expect.restoreSpies();
    });

    it('should support using redux manage data for page', function (done) {
        let rawGetCurrApp = na.getCurrApp;
        na.getCurrApp = function () {
            return {
                $store: store
            };
        };

        let page = MyPage({
            data: {
                c: 0
            },
            computed: {
            },

            $store: {
                computed: ['counter'],
                actions: {
                    addCounter(value = 1) {
                        return {type: 'INCREMENT', value};
                    },
                    minusCounter(value = 1) {
                        return {type: 'DECREMENT', value};
                    }
                }
            },

            created() {
                let state = this.$store.getState();
                expect(state).toEqual({counter: 0});
            },

            methods: {
                onAddCounter() {
                    this.addCounter(5);
                },

                onMinusCounter() {
                    this.minusCounter();
                }
            }
        });

        let spySetData = createSpy(() => {});
        page.setData = spySetData;

        page.onLoad();

        assert(page.counter === 0);

        setTimeout(() => {
            expect(spySetData).toHaveBeenCalled();
            assert(spySetData.calls.length === 1);
            let args = spySetData.calls[0].arguments;
            expect(args.slice(0, args.length - 1)).toEqual([{counter: 0}]);

            page.onAddCounter();
            page.onMinusCounter();
            assert(page.counter === 4);

            expect(page.$store.getState()).toEqual({counter: 4});

            setTimeout(() => {
                assert(spySetData.calls.length === 2);

                args = spySetData.calls[1].arguments;
                expect(args.slice(0, args.length - 1)).toEqual([{counter: 4}]);

                na.getCurrApp = rawGetCurrApp;
                done();
            });
        });

    });

    it('should remove store watcher when page hide or destroyed', function () {
        na.getCurrApp = function () {
            return {
                $store: store
            };
        };

        let spyHide = createSpy(() => {});
        let spyShow = createSpy(() => {});
        let instance = MyPage({
            $store: {
                computed: ['counter']
            },
            onHide: spyHide,
            onShow: spyShow
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.onLoad();

        assert(typeof instance.counter === 'number');
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
                $store: store
            };
        };

        let instance = MyPage({
            $store: {
                computed: ['counter']
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.onLoad();

        assert(typeof instance.counter === 'number');
        assert(typeof instance.__unsubscribeStore === 'function');

        instance.$unsubscribeStoreChange();
        assert(instance.__unsubscribeStore === null);

        instance.$subscribeStoreChange();
        assert(typeof instance.__unsubscribeStore === 'function');
    });

    it('should remove store watcher when component hide or destroyed', function () {
        na.getCurrApp = function () {
            return {
                $store: store
            };
        };

        let instance = MyComponent({
            $store: {
                computed: ['counter']
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        instance.attached();
        instance.ready();

        assert(instance.onShow === undefined);
        assert(instance.onHide === undefined);

        assert(typeof instance.counter === 'number');
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

    it('should support $store function', function () {
        na.getCurrApp = function () {
            return {
                $store: () => store
            };
        };

        let instance = MyComponent({
            $store: {
                computed: ['counter']
            }
        });

        let spySetData = createSpy(() => {});
        instance.setData = spySetData;

        instance.created();
        instance.attached();
        instance.ready();

        assert(typeof instance.counter === 'number');
    });

});
