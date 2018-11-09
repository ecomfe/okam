/**
 * @file Swan observable data test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */

import assert from 'assert';
import expect, {createSpy, spyOn} from 'expect';
import MyApp from 'core/App';
import MyPage from 'core/Page';
import * as na from 'core/na/index';
import base from 'core/base/base';
import component from 'core/base/component';
import {clearBaseCache} from 'core/helper/factory';
import {fakeComponent} from 'test/helper';
import {setPropDataKey} from 'core/extend/data/observable';
import observable from 'core/extend/data/observable/ant';

describe('ant observable', function () {
    const rawEnv = na.env;
    const rawGetCurrApp = na.getCurrApp;

    let MyComponent;

    beforeEach('init global App', function () {
        clearBaseCache();

        MyComponent = fakeComponent();

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

        setPropDataKey('props');

        na.getCurrApp = function () {
            return {};
        };
        na.env = base.$api = global.swan;
    });

    afterEach('clear global App', function () {
        MyComponent = undefined;
        global.swan = undefined;
        na.getCurrApp = rawGetCurrApp;
        na.env = base.$api = rawEnv;
        setPropDataKey('data');
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

    it('should make props observable', function () {
        MyApp.use(observable);
        let instance = MyComponent({
            props: {
                a: String
            },

            created() {
                assert(this.a === this.props.a);
            }
        });

        instance.props = {a: 'a'};
        instance.created();

        assert(instance.a === 'a');
    });
});
