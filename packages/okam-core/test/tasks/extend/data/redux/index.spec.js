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
import {clearBaseCache} from 'core/helper/factory';
import reduxPlugin from 'core/extend/data/redux/index';
import observable from 'core/extend/data/observable';
import store from './store/index';
import {fakeAppEnvAPIs} from 'test/helper';

describe('behavior', function () {
    let restoreAppEnv;

    beforeEach('init global App', function () {
        clearBaseCache();

        restoreAppEnv = fakeAppEnvAPIs('swan');
    });

    afterEach('clear global App', function () {
        restoreAppEnv();
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
