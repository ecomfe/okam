/**
 * @file na/api test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

import assert from 'assert';
import expect, {spyOn, createSpy} from 'expect';
import {promisify, promisifyApis, interceptApis} from 'core/na/api';
import {isPromise} from '../../helper';

describe('na/api', function () {

    afterEach(() => {
        expect.restoreSpies();
    });

    it('should call promisify api with default context', function () {
        let spyApi =  createSpy(() => 3).andCallThrough();
        let promisifyApi = promisify(spyApi);
        let result = promisifyApi();
        assert.ok(isPromise(result));
        expect(spyApi).toHaveBeenCalled();
        expect(spyApi.calls[0].context).toBe(null);
        assert(spyApi.calls.length === 1);
    });

    it('should promisify apis', function (done) {
        let ctx = {
            $api: {
                api(opts) {
                    opts.fail('err');
                },
                api2(opts) {
                    opts.success('ok');
                }
            }
        };

        promisifyApis(['api', 'api2'], ctx);

        let spyApi = spyOn(ctx.$api, 'api').andCallThrough();
        let spyFail = createSpy(() => {});
        let spyFailCallback = createSpy(() => {});
        let result = ctx.$api.api({a: 3, fail: spyFailCallback}).catch(spyFail);


        let spyApi2 = spyOn(ctx.$api, 'api2').andCallThrough();
        let spyOk = createSpy(() => {});
        let spySuccessCallback = createSpy(() => {});
        let result2 = ctx.$api.api2({b: 6, success: spySuccessCallback}).then(spyOk);

        setTimeout(() => {
            expect(spyApi).toHaveBeenCalledWith({a: 3, fail: spyFailCallback});
            expect(spyFail).toHaveBeenCalledWith('err');
            expect(spyFailCallback).toHaveBeenCalledWith('err');
            assert.ok(isPromise(result));

            expect(spyApi2).toHaveBeenCalledWith({b: 6, success: spySuccessCallback});
            expect(spyOk).toHaveBeenCalledWith('ok');
            expect(spySuccessCallback).toHaveBeenCalledWith('ok');
            assert.ok(isPromise(result2));

            done();
        });
    });

    it('should not promisify api if api is not writable in ctx', function (done) {
        let ctx = {
            $api: {
                api(opts) {
                    opts.fail('err');
                }
            }
        };

        let spyApi2 = createSpy(() => {});
        Object.defineProperties(ctx.$api, {
            api2: {
                get() {
                    return spyApi2;
                }
            }
        });

        assert.throws(() => promisifyApis(['api', 'api2'], ctx), function (err) {
            return err.toString().indexOf('which has only a getter') !== -1;
        });

        let spyApi = spyOn(ctx.$api, 'api').andCallThrough();
        let spyFail = createSpy(() => {});
        let result = ctx.$api.api({a: 3}).catch(spyFail);
        let result2 = ctx.$api.api2({b: 6});

        setTimeout(() => {
            expect(spyApi).toHaveBeenCalledWith({a: 3});
            expect(spyFail).toHaveBeenCalledWith('err');
            assert.ok(isPromise(result));

            expect(spyApi2).toHaveBeenCalledWith({b: 6});
            assert.ok(!isPromise(result2));

            done();
        });
    });

    it('should intercept apis', function (done) {
        let ctx = {
            $api: {
                api(opts) {
                    return Promise.resolve(23);
                },
                api2(opts) {
                    setTimeout(() => {
                        opts.success('ok');
                    });
                },
                api3() {
                    return 5;
                }
            }
        };

        let interceptConf = {
            api: {
                init(args) {
                    args[0].t = 3;
                },

                done(err, data) {
                    return {err, data};
                }
            },

            api2: {
                init() {

                }
            },

            api3: {
                done(err, data) {
                    return data + 5;
                }
            },
            api4: {}
        };

        let spyApi = spyOn(ctx.$api, 'api').andCallThrough();
        let spyApiInit = spyOn(interceptConf.api, 'init').andCallThrough();
        let spyApiDone = spyOn(interceptConf.api, 'done').andCallThrough();
        let spyApi2Init = spyOn(interceptConf.api2, 'init').andCallThrough();
        let spyApi3Done = spyOn(interceptConf.api3, 'done').andCallThrough();

        interceptApis(interceptConf, '$api', ctx);

        let spyOk = createSpy(() => {});
        ctx.$api.api({a: 3}, 24).then(spyOk);

        const api2Opts = {a: 3, success(result) {
            assert(result === 'ok');
        }};
        ctx.$api.api2(api2Opts);
        let syncResult = ctx.$api.api3();
        assert(syncResult === 10);

        setTimeout(() => {
            assert(spyApiInit.calls.length === 1);
            expect(spyApiInit.calls[0].arguments).toEqual([[{a: 3, t: 3}, 24], ctx]);

            assert(spyApi.calls.length === 1);
            expect(spyApi.calls[0].arguments).toEqual([{a: 3, t: 3}, 24]);

            assert(spyApiDone.calls.length === 1);
            expect(spyApiDone.calls[0].arguments).toEqual([null, 23, ctx]);

            assert(spyOk.calls.length === 1);
            expect(spyOk.calls[0].arguments).toEqual([{err: null, data: 23}]);

            assert(spyApi2Init.calls.length === 1);
            expect(spyApi2Init.calls[0].arguments).toEqual([api2Opts, ctx]);

            assert(spyApi3Done.calls.length === 1);
            expect(spyApi3Done.calls[0].arguments).toEqual([null, 5, ctx]);

            done();
        }, 10);

    });

    it('should not intercept the api if api is not writable in ctx', function (done) {
        let ctx = {
            $api: {
                api() {}
            }
        };

        Object.defineProperties(ctx.$api, {
            api2: {
                get() {
                    return () => {};
                }
            },

            api3: {
                get() {
                    return this._func || (() => {});
                },
                set(func) {
                    this._func = func;
                }
            }
        });

        let interceptConf = {
            api: {
                init() {}
            },

            api2: {
                init() {}
            },

            api3: {
                init() {}
            }
        };

        let spyApiInit = spyOn(interceptConf.api, 'init').andCallThrough();
        let spyApi2Init = spyOn(interceptConf.api2, 'init').andCallThrough();
        let spyApi3Init = spyOn(interceptConf.api3, 'init').andCallThrough();

        assert.throws(() => interceptApis(interceptConf, '$api', ctx), function (err) {
            return err.toString().indexOf('which has only a getter') !== -1;
        });

        ctx.$api.api({});
        ctx.$api.api2({});
        ctx.$api.api3({});

        setTimeout(() => {
            expect(spyApiInit).toHaveBeenCalled();
            expect(spyApi2Init).toNotHaveBeenCalled();
            expect(spyApi3Init).toNotHaveBeenCalled();

            done();
        });
    });

    it('should reject when done throw exception', function (done) {
        let ctx = {
            $api: {
                api(opts) {
                    return Promise.reject(23);
                }
            }
        };

        let interceptConf = {
            api: {
                init(args) {
                    args[0] = 3;
                },

                done(err, data) {
                    if (err) {
                        throw err;
                    }
                    return {data};
                }
            }
        };

        let spyApi = spyOn(ctx.$api, 'api').andCallThrough();
        let spyApiDone = spyOn(interceptConf.api, 'done').andCallThrough();

        interceptApis(interceptConf, '$api', ctx);

        let spyCatch = createSpy(() => {});
        ctx.$api.api(24).catch(spyCatch);

        setTimeout(() => {
            assert(spyApi.calls.length === 1);
            expect(spyApi.calls[0].arguments).toEqual([3]);

            assert(spyApiDone.calls.length === 1);
            expect(spyApiDone.calls[0].arguments).toEqual([23, null, ctx]);

            expect(spyCatch).toHaveBeenCalledWith(23);

            done();
        });

    });
});
