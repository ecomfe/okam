/**
 * @file Swan observable data test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */
/* global before:false */
/* global after:false */

import assert from 'assert';
import expect from 'expect';
import MyApp from 'core/ant/App';
import MyPage from 'core/ant/Page';
import {clearBaseCache} from 'core/helper/factory';
import {setObservableContext} from 'core/extend/data/observable';
import observable from 'core/extend/data/observable/ant';
import {fakeAntComponent, fakeAppEnvAPIs} from 'test/helper';
import {resetObservableArray, initAntObservableArray, fakeAntArrayAPIs} from '../helper';

describe('ant observable', function () {
    let MyComponent;
    let restoreAppEnv;
    let restoreAntArrayApi;

    before('init observable array', function () {
        initAntObservableArray();
    });

    after('restore observable array', function () {
        resetObservableArray();
    });

    beforeEach('init global App', function () {
        clearBaseCache();

        MyComponent = fakeAntComponent();
        restoreAppEnv = fakeAppEnvAPIs('ant');
        restoreAntArrayApi = fakeAntArrayAPIs();

        setObservableContext('props', true);
    });

    afterEach('clear global App', function () {
        MyComponent = undefined;
        restoreAppEnv();
        restoreAntArrayApi();
        setObservableContext('data', false);
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
        instance.didMount();

        assert(instance.a === 'a');
    });
});
