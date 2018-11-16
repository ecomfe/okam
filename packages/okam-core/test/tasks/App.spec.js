/**
 * @file App test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */
/* eslint-disable fecs-min-vars-per-destructure */

import assert from 'assert';
import expect, {createSpy, spyOn} from 'expect';
import MyApp from 'core/App';
import application from 'core/base/application';
import base from 'core/base/base';
import {clearBaseCache} from 'core/helper/factory';
import {testCallOrder, fakeAppEnvAPIs} from 'test/helper';

describe('App', () => {
    let restoreAppEnv;
    beforeEach('init global App', function () {
        clearBaseCache();
        restoreAppEnv = fakeAppEnvAPIs('swan');
    });

    afterEach('clear global App', function () {
        restoreAppEnv();
        expect.restoreSpies();
    });

    it('should inherit base api', () => {
        let appInstance = {};
        let app = MyApp(appInstance);
        app.onLaunch();

        Object.keys(base).forEach(k => {
            assert(app[k] === base[k]);
        });
    });

    it('should call base onLaunch/onShow in order', () => {
        const appInstance = {
            onLaunch() {},
            onShow() {}
        };
        testCallOrder(
            ['onLaunch', 'onShow'],
            appInstance,
            MyApp,
            [application]
        );
    });

    it('should call once for promisifyApis initalization', () => {
        let appInstance = {
            promisifyApis: [
                'getSystemInfo'
            ]
        };
        let app = MyApp(appInstance);
        assert(!app.__apisInited);
        app.onLaunch();
        assert(app.__apisInited);
        app.onShow();
        assert(app.__apisInited);
        app.onShow();
        assert(app.__apisInited);
    });

    it('should support $promisifyApis options', () => {
        let testApiSuccessData = {a: 3};
        let testApiRawFunc = createSpy(opts => {
            opts.success(testApiSuccessData);
        }).andCallThrough();
        base.$api.testApi = testApiRawFunc;
        let rawGetSystemInfo = base.$api.getSystemInfo;

        let app = MyApp({
            $promisifyApis: ['getSystemInfo', 'testApi'],
            onLaunch() {
                assert(this.$api.getSystemInfo() instanceof Promise);
            },
            onShow() {
                assert(this.$api.getSystemInfo() instanceof Promise);
            }
        });
        app.onLaunch();
        app.onShow();

        let getSystemInfo = app.$api.getSystemInfo;
        let request = app.$api.request;
        let testApi = app.$api.testApi;
        assert(typeof getSystemInfo === 'function');
        assert(getSystemInfo() instanceof Promise);

        assert(app.$api !== global.swan);
        assert(app.$api.getSystemInfo !== rawGetSystemInfo);
        assert(app.$api.testApi !== testApiRawFunc);
        assert(typeof testApi === 'function');

        let testSuccessCallback = createSpy(() => {});
        let testFailCallback = createSpy(() => {});
        let testApiCallArg = {
            success: testSuccessCallback,
            fail: testFailCallback,
            data: {b: 3}
        };
        let testApiResult = testApi(testApiCallArg);
        assert(testApiResult instanceof Promise);
        expect(testSuccessCallback).toHaveBeenCalledWith(testApiSuccessData);
        expect(testFailCallback).toNotHaveBeenCalled();
        assert(testApiRawFunc.calls.length === 1);
        assert(testApiCallArg.data === testApiRawFunc.calls[0].arguments[0].data);
        testApiResult.then(res => {
            assert(res === testApiSuccessData);
        });

        assert(typeof request === 'function');
        assert(!(request() instanceof Promise));
    });

    it('should support $interceptApis options', function (done) {
        base.$http.request = function (opts) {
            let {data} = opts;
            if (data > 1) {
                return Promise.resolve(data);
            }
            return Promise.reject(data);
        };
        let testApiRawFunc = createSpy(() => {});
        let apis = base.$api;
        apis.testApi = testApiRawFunc;
        apis.request = base.$http.request;

        let doneRequestSpy = createSpy((err, res) => {
            return {isFail: !!err, data: res};
        }).andCallThrough();
        let initRequestSpy = createSpy(() => {});
        const requestInitArgs = [
            {url: 'http://xx1', data: 1, method: 'GET'},
            {url: 'http://xx2', data: 2, method: 'POST'},
            {url: 'http://xx3', data: 3}
        ];

        let doneTestSpy = createSpy(() => {});
        let initTestSpy = createSpy(args => (args[0] = 'abc')).andCallThrough();
        let app = MyApp({
            $interceptApis: {
                request: {
                    init: initRequestSpy,
                    done: doneRequestSpy
                },
                testApi: {
                    init: initTestSpy,
                    done: doneTestSpy
                }
            },
            onLaunch() {
                this.$http.get(
                    requestInitArgs[0].url,
                    {data: requestInitArgs[0].data}
                ).then(res => {
                    expect(res).toEqual({isFail: true, data: null});
                });
            },
            onShow() {
                this.$http.post(
                    requestInitArgs[1].url,
                    {data: requestInitArgs[1].data}
                ).then(res => {
                    expect(res).toEqual({isFail: false, data: 2});
                });
            }
        });
        app.onLaunch();
        app.onShow();

        let request = app.$api.request;
        request(requestInitArgs[2]).then(res => {
            expect(res).toEqual({isFail: false, data: 3});
        });
        initRequestSpy.calls.forEach((item, idx) => {
            expect(item.arguments[0]).toEqual(requestInitArgs[idx]);
        });
        assert(initRequestSpy.calls.length === 3);

        setTimeout(() => {
            let calls = doneRequestSpy.calls;
            assert(calls.length === 3);
            assert(calls[0].arguments[0] === 1);
            assert(calls[0].arguments[1] === null);

            assert(calls[1].arguments[0] === null);
            assert(calls[1].arguments[1] === 2);

            assert(calls[2].arguments[0] === null);
            assert(calls[2].arguments[1] === 3);

            done();
        }, 0);

        let testApi = app.$api.testApi;
        assert(testApi !== testApiRawFunc);
        testApi(23);
        expect(testApiRawFunc).toHaveBeenCalledWith('abc');
    });

    it('should call app plugin lifecycle hooks in order', function () {
        let myPlugin = {
            app: {
                onLaunch() {},
                onShow() {},
                hi() {},
                test() {}
            }
        };
        let appInstance = {
            onShow() {},
            onLaunch() {},
            test() {}
        };

        MyApp.use(myPlugin);

        testCallOrder(
            ['onLaunch', 'onShow', 'test'],
            appInstance,
            MyApp,
            [application, myPlugin.app]
        );
    });

    it('should extend the given app plugin', function () {
        let myPlugin = {
            app: {
                onLaunch() {},
                onShow() {},
                hi() {},
                test() {}
            }
        };

        let spyPluginHi = spyOn(myPlugin.app, 'hi');
        let spyPluginTest = spyOn(myPlugin.app, 'test');
        MyApp.use(myPlugin);

        let appInstance = {
            onShow() {},
            onLaunch() {},
            test() {}
        };
        let spyTest = spyOn(appInstance, 'test');
        let app = MyApp(appInstance);
        app.onLaunch();
        app.onShow();

        app.test();
        expect(spyPluginTest).toHaveBeenCalled();
        expect(spyTest).toHaveBeenCalled();

        assert(typeof app.hi === 'function');
        app.hi(2);
        expect(spyPluginHi).toHaveBeenCalledWith(2);
        expect(spyPluginHi.calls[0].context).toBe(app);
    });

    it('should install once for the same plugin', () => {
        let myPlugin = {
            app: {
                hi() {}
            }
        };

        let result = MyApp.use(myPlugin);
        assert(result);

        result = MyApp.use(myPlugin);
        assert(!result);
    });

    it('should support plugin options', () => {
        let spyInit = createSpy(() => {});
        let myPlugin = {
            init: spyInit,
            app: {
                hi() {}
            }
        };

        let pluginOpts = {a: 3};
        MyApp.use(myPlugin, pluginOpts);
        expect(spyInit).toHaveBeenCalledWith(pluginOpts);
    });
});
