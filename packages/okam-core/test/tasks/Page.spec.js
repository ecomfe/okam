/**
 * @file Page test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */
/* eslint-disable fecs-min-vars-per-destructure */

import assert from 'assert';
import expect, {createSpy, spyOn} from 'expect';
import MyApp from 'core/App';
import MyPage from 'core/Page';
import page from 'core/base/page';
import component from 'core/base/component';
import {clearBaseCache} from 'core/helper/factory';
import {testCallOrder, fakeAppEnvAPIs} from 'test/helper';

describe('Page', () => {
    let restoreAppEnv;

    beforeEach('init global App', function () {
        clearBaseCache();
        restoreAppEnv = fakeAppEnvAPIs('swan');
    });

    afterEach('clear global App', function () {
        restoreAppEnv();
        expect.restoreSpies();
    });

    it('should inherit component api', () => {
        let pageInstance = {};
        let page = MyPage(pageInstance);
        Object.keys(component).forEach(k => {
            if (k !== 'methods') {
                assert(page[k] === component[k]);
            }
        });
        Object.keys(component.methods).forEach(k => {
            assert(page[k] === component.methods[k]);
        });
    });

    it('should call base onLoad/onReady/onUnload in order', () => {
        const pageInstance = {
            onLoad() {},
            onReady() {},
            onUnload() {}
        };
        testCallOrder(
            ['onLoad', 'onReady', 'onUnload'],
            pageInstance,
            MyPage,
            [page]
        );
    });

    it('should init $query when onLoad', () => {
        let query = {a: 3};
        let page = MyPage({
            onLoad() {
                assert(this.$query === query);
            }
        });
        page.onLoad(query);

        assert(page.$query === query);
    });

    it('should call created when onLoad', () => {
        let createdCallOrder = [];
        const pageInstance = {
            onLoad() {},
            created() {
                createdCallOrder.push(2);
            }
        };

        let spyBaseCreated = spyOn(page, 'created').andCall(
            () => createdCallOrder.push(1)
        );
        let spyCreated = spyOn(pageInstance, 'created')
            .andCallThrough();
        let instance = MyPage(pageInstance);
        instance.onLoad();
        expect(spyCreated).toHaveBeenCalled();
        expect(spyBaseCreated).toHaveBeenCalled();
        assert(createdCallOrder.join('') === '12');
    });

    it('should call attached and ready when onReady', () => {
        const pageInstance = {
            onReady() {}
        };

        let callOrder = [];
        let spyBaseAttached = spyOn(page, 'attached')
            .andCall(() => callOrder.push(1));
        let spyBaseReady = spyOn(page, 'ready')
            .andCall(() => callOrder.push(2));
        let instance = MyPage(pageInstance);
        instance.onReady();

        expect(spyBaseAttached).toHaveBeenCalled();
        expect(spyBaseReady).toHaveBeenCalled();
        assert(callOrder.join('') === '12');
    });

    it('should call detached when onUnload', () => {
        const pageInstance = {
            onUnload() {}
        };
        let spyBaseDetached = spyOn(page, 'detached');
        let instance = MyPage(pageInstance);
        instance.onUnload();

        expect(spyBaseDetached).toHaveBeenCalled();
    });

    it('should can call method defined in methods', () => {
        let pageInstance = {
            test() {},
            test2() {
                assert(typeof this.hi === 'function');
            },
            methods: {
                hi() {},
                hi2() {
                    assert(typeof this.hi === 'function');
                },
                test() {}
            }
        };
        let spyTest = spyOn(pageInstance, 'test');
        let spyMethodsTest = spyOn(pageInstance.methods, 'test');
        let instance = MyPage(pageInstance);

        assert(typeof instance.hi === 'function');
        instance.hi2();
        instance.test2();

        instance.test();
        expect(spyMethodsTest).toHaveBeenCalled();
        expect(spyTest).toNotHaveBeenCalled();
        expect(spyMethodsTest.calls[0].context).toBe(instance);
    });

    it('should call $init before normalize', () => {
        let pageInstance = {
            $init() {
                assert(typeof this.data !== 'function');
                assert(!this.hi);
            },

            data() {
                return {a: 3};
            },
            methods: {
                hi() {}
            }
        };
        let spyInit = spyOn(pageInstance, '$init').andCallThrough();
        let page = MyPage(pageInstance);

        expect(spyInit).toHaveBeenCalledWith(true, undefined);
        expect(spyInit.calls[0].context).toBe(pageInstance);
        assert(typeof page.hi === 'function');
    });

    it('should execute the given page plugin api in order', function () {
        let myPlugin = {
            page: {
                onLoad() {},
                onReady() {},
                onUnload() {},
                methods: {
                    $emit() {},
                    test() {}
                }
            }
        };
        MyApp.use(myPlugin);

        let pageInstance = {
            onLoad() {},
            onReady() {},
            onUnload() {},
            methods: {
                test() {}
            }
        };
        testCallOrder(
            ['onLoad', 'onReady', 'onUnload', 'methods.test', 'methods.$emit'],
            pageInstance,
            MyPage,
            [component, myPlugin.page]
        );
    });

    it('should extend the given page plugin', function () {
        let myPlugin = {
            page: {
                methods: {
                    test() {}
                }
            }
        };

        let spyPluginTest = spyOn(myPlugin.page.methods, 'test');
        MyApp.use(myPlugin);

        let pageInstance = {
            methods: {
                test2() {}
            }
        };
        let spyTest2 = spyOn(pageInstance.methods, 'test2');
        let page = MyPage(pageInstance);
        page.onLoad();
        page.onReady();

        page.test();
        expect(spyPluginTest).toHaveBeenCalled();
        expect(spyPluginTest.calls[0].context).toBe(page);

        page.test2(2);
        expect(spyTest2).toHaveBeenCalledWith(2);
        expect(spyTest2.calls[0].context).toBe(page);
    });

    it('should inherit component extension', () => {
        let myPlugin = {
            component: {
                methods: {
                    hi() {},
                    test() {}
                }
            }
        };

        let spyPluginTest = spyOn(myPlugin.component.methods, 'test');
        MyApp.use(myPlugin);

        let pageInstance = {
            mounted() {
                assert(typeof this.hi === 'function');
                this.hi();
                this.test();
            },

            methods: {
                test() {}
            }
        };
        let spyTest = spyOn(pageInstance.methods, 'test');
        let page = MyPage(pageInstance);
        page.onLoad();
        page.onReady();

        expect(spyTest).toHaveBeenCalled();
        expect(spyPluginTest).toNotHaveBeenCalled();
    });

    it('should call lifeCycle hooks in order', () => {
        const lifecycleHooks = [
            'beforeCreate', 'created',
            'beforeMount', 'mounted',
            'beforeDestroy', 'destroyed'
        ];
        let spyers = [];
        let pageInstance = {};
        let callOrders = [];
        lifecycleHooks.forEach((k, idx) => {
            let spy = createSpy(() => {}).andCall(() => callOrders.push(idx));
            spyers.push(spy);
            pageInstance[k] = spy;
        });
        let page = MyPage(pageInstance);
        page.onLoad();
        page.onReady();
        page.onUnload();

        spyers.forEach(item => {
            expect(item).toHaveBeenCalled();
            expect(item.calls[0].context).toBe(page);
        });
    });
});
