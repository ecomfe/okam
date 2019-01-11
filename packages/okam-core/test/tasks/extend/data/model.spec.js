/**
 * @file v-model support
 * @author xiaohong8023@outlook.com
 */

'use strict';

/* eslint-disable babel/new-cap */

import assert from 'assert';
import expect from 'expect';
import MyApp from 'core/swan/App';
import MyPage from 'core/swan/Page';
import {clearBaseCache} from 'core/helper/factory';
import model from 'core/extend/data/model';
// import component from 'core/base/component';
// import page from 'core/base/page';
import {fakeComponent, fakeAppEnvAPIs} from 'test/helper';

describe('model plugin', function () {

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

    it('should support model in page: support observe', () => {
        MyApp.use(model);

        let modelInfo = {isSupportObserve: true};
        let page = MyPage({
            data: {
                value: ''
            },
            beforeCreate() {
                assert(this.$isSupportObserve === true);
            },
            created() {
                assert(this.$isSupportObserve === true);
            },
            beforeMount() {
                assert(this.$isSupportObserve === true);
            },
            mounted() {
                assert(this.$isSupportObserve === true);
            }
        }, modelInfo);
        assert(typeof page.__handlerModelProxy === 'function');

        // 有detail
        page.__handlerModelProxy({
            type: 'change',
            currentTarget: {dataset: {
                okamModelArgs: 'value,value'
            }, id: undefined},
            target: {dataset: {
                okamModelArgs: 'value,value'
            }, id: undefined},
            detail: {value: 1, a: 3}
        });
        assert(page.value === 1);

        // detail 为 event.detail 本身
        page.__handlerModelProxy({
            type: 'change',
            currentTarget: {dataset: {
                okamModelArgs: 'value'
            }, id: undefined},
            target: {dataset: {
                okamModelArgs: 'value'
            }, id: undefined},
            detail: 2
        });
        assert(page.value === 2);

        // 有 detail 为 detail 不存在
        page.__handlerModelProxy({
            type: 'change',
            currentTarget: {dataset: {
                okamModelArgs: 'value,value'
            }, id: undefined},
            target: {dataset: {
                okamModelArgs: 'value,value'
            }, id: undefined},
            detail: 2
        });
        assert(page.value === undefined);
        assert(page.value !== 2);

        page.onLoad();
        page.onReady();
        assert(page.$isSupportObserve === true);
    });

    it('should support model in page: not support observe', () => {
        MyApp.use(model);

        let page = MyPage({
            data: {
                value: ''
            },

            // 无小程序环境 暂时简单模拟
            setData(obj) {
                Object.keys(obj).forEach(item => {
                    this.data[item] = obj[item];
                });
            },
            beforeCreate() {
                assert(this.$isSupportObserve === undefined);
            },
            created() {
                assert(this.$isSupportObserve === undefined);
            },
            beforeMount() {
                assert(this.$isSupportObserve === undefined);
            },
            mounted() {
                assert(this.$isSupportObserve === undefined);
            }
        });
        assert(typeof page.__handlerModelProxy === 'function');
        page.__handlerModelProxy({
            type: 'change',
            currentTarget: {dataset: {
                okamModelArgs: 'value,value'
            }, id: undefined},
            target: {dataset: {
                okamModelArgs: 'value,value'
            }, id: undefined},
            detail: {value: 1, a: 3}
        });
        // 无小程序环境 暂时data 替换模拟
        assert(page.data.value === 1);
        page.onLoad();
        page.onReady();
        assert(page.$isSupportObserve === undefined);
    });

    it('should support model in component', () => {
        MyApp.use(model);

        let modelInfo = {isSupportObserve: true};
        let instance = MyComponent({
            beforeCreate() {
                assert(this.$isSupportObserve !== null);
            },
            created() {
                assert(this.$isSupportObserve !== null);
            },
            beforeMount() {
                assert(this.$isSupportObserve !== null);
            },
            mounted() {
                assert(this.$isSupportObserve !== null);
            }
        }, modelInfo);

        assert(typeof instance.__handlerModelProxy === 'function');
        instance.created();
        instance.attached();
        instance.ready();
        assert(instance.$isSupportObserve !== null);
    });

    it('should support none model info provided', () => {
        MyApp.use(model);

        let instance = MyComponent({});
        instance.created();
        instance.attached();
        instance.ready();

        expect(instance.__handlerModelProxy === undefined);
        expect(instance.$isSupportObserve === undefined);
    });
});
