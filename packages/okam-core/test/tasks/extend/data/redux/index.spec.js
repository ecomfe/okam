/**
 * @file Redux support test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */
/* eslint-disable fecs-properties-quote */

import assert from 'assert';
import expect, {createSpy} from 'expect';
import MyApp from 'core/App';
import MyPage from 'core/Page';
import * as na from 'core/na/index';
import base from 'core/base/base';
import component from 'core/base/component';
import {clearBaseCache} from 'core/helper/factory';
import reduxPlugin from 'core/extend/data/redux/index';
import observable from 'core/extend/data/observable';
import store from './store/index';

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
    });

    afterEach('clear global App', function () {
        global.Component = undefined;
        global.Page = undefined;
        global.swan = undefined;
        component.selectComponent = rawSelectComponent;
        na.getCurrApp = rawGetCurrApp;
        na.env = base.$api = rawEnv;
        expect.restoreSpies();
    });

    it('should support using redux manage data for page', function (done) {
        MyApp.use(observable);
        MyApp.use(reduxPlugin);

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

                done();
            });
        });

    });

});
