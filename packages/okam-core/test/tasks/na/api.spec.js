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

    it('should intercept api response content for async API', function (done) {
        let ctx = {
            $api: {
                api(opts) {
                    setTimeout(() => {
                        opts.fail && opts.fail('fail');
                        opts.complete && opts.complete('fail');
                    });
                },
                api2(opts) {
                    setTimeout(() => {
                        opts.success && opts.success('ok');
                        opts.complete && opts.complete('ok');
                    });
                },
                api3(opts) {
                    let data = 'abc';
                    setTimeout(() => {
                        opts.success && opts.success(data);
                        opts.complete && opts.complete(data);
                    });
                }
            }
        };

        ctx.$api.api3 = promisify(ctx.$api.api3);

        let interceptConf = {
            api: {
                done(err, data) {
                    return {err, data};
                }
            },

            api2: {
                done(err, data) {
                    return {data, a: 2};
                }
            },

            api3: {
                done(err, data) {
                    if (err) {
                        throw err;
                    }
                    return data + '666';
                }
            }
        };

        let spyApi = spyOn(ctx.$api, 'api').andCallThrough();
        let spyApi2 = spyOn(ctx.$api, 'api2').andCallThrough();
        let spyApi3 = spyOn(ctx.$api, 'api3').andCallThrough();
        let spyApiDone = spyOn(interceptConf.api, 'done').andCallThrough();
        let spyApi2Done = spyOn(interceptConf.api2, 'done').andCallThrough();
        let spyApi3Done = spyOn(interceptConf.api3, 'done').andCallThrough();

        interceptApis(interceptConf, '$api', ctx);

        let spySuccess = createSpy(() => {}).andCallThrough();
        let spyFail = createSpy(() => {}).andCallThrough();
        ctx.$api.api({a: 1, success: spySuccess, fail: spyFail});

        let spySuccess2 = createSpy(() => {}).andCallThrough();
        let spyFail2 = createSpy(() => {}).andCallThrough();
        let spyComplete2 = createSpy(() => {}).andCallThrough();
        const api2Opts = {
            a: 2,
            success: spySuccess2,
            fail: spyFail2,
            complete: spyComplete2
        };
        ctx.$api.api2(api2Opts);

        let spyResolve3 = createSpy(() => {}).andCallThrough();
        let spyReject3 = createSpy(() => {}).andCallThrough();
        let spySuccess3 = createSpy(() => {}).andCallThrough();
        let spyFail3 = createSpy(() => {}).andCallThrough();
        ctx.$api.api3({a: 3, success: spySuccess3, fail: spyFail3}).then(
            spyResolve3, spyReject3
        );

        setTimeout(() => {
            expect(spySuccess).toNotHaveBeenCalled();
            expect(spyFail).toHaveBeenCalledWith({err: 'fail', data: null});
            assert(spyFail.calls.length === 1);

            assert(spyApi.calls.length === 1);
            expect(Object.keys(spyApi.calls[0].arguments[0])).toEqual([
                'a', 'success', 'fail'
            ]);

            expect(spyApiDone).toHaveBeenCalled();
            assert(spyApiDone.calls.length === 1);
            expect(spyApiDone.calls[0].arguments).toEqual(['fail', null, ctx]);

            let doneData2 = {data: 'ok', a: 2};
            expect(spySuccess2).toHaveBeenCalledWith(doneData2);
            assert(spySuccess2.calls.length === 1);
            expect(spyComplete2).toHaveBeenCalledWith(doneData2);
            assert(spyComplete2.calls.length === 1);
            expect(spyFail2).toNotHaveBeenCalled();

            expect(spyApi2Done).toHaveBeenCalled();
            assert(spyApi2Done.calls.length === 1);
            expect(spyApi2Done.calls[0].arguments).toEqual([null, 'ok', ctx]);

            expect(spyApi2).toHaveBeenCalled();
            assert(spyApi2.calls.length === 1);
            expect(Object.keys(spyApi2.calls[0].arguments[0])).toEqual([
                'a', 'success', 'fail', 'complete'
            ]);
            assert(spyApi2.calls[0].arguments[0].complete === undefined);

            expect(spySuccess3).toHaveBeenCalledWith('abc666');
            assert(spySuccess3.calls.length === 1);
            expect(spyFail3).toNotHaveBeenCalled();
            expect(spyResolve3).toHaveBeenCalledWith('abc666');
            assert(spyResolve3.calls.length === 1);
            expect(spyReject3).toNotHaveBeenCalled();

            expect(spyApi3Done).toHaveBeenCalled();
            assert(spyApi3Done.calls.length === 1);
            expect(spyApi3Done.calls[0].arguments).toEqual([null, 'abc', ctx]);

            expect(spyApi3).toHaveBeenCalled();
            assert(spyApi3.calls.length === 1);
            expect(Object.keys(spyApi3.calls[0].arguments[0])).toEqual([
                'a', 'success', 'fail'
            ]);

            done();
        }, 10);
    });

    it('should reject when throw exception in done callback for async API', function (done) {
        let ctx = {
            $api: {
                api(opts) {
                    let err = 'err233';
                    setTimeout(() => {
                        opts.fail && opts.fail(err);
                        opts.complete && opts.complete(err);
                    });
                }
            }
        };

        ctx.$api.api = promisify(ctx.$api.api);

        let interceptConf = {
            api: {
                done(err, data) {
                    if (err) {
                        throw err + '666';
                    }
                    return data + '666';
                }
            }
        };

        let spyApi = spyOn(ctx.$api, 'api').andCallThrough();
        let spyApiDone = spyOn(interceptConf.api, 'done').andCallThrough();

        interceptApis(interceptConf, '$api', ctx);

        let spyResolve = createSpy(() => {}).andCallThrough();
        let spyReject = createSpy(() => {}).andCallThrough();
        let spyFail = createSpy(() => {}).andCallThrough();
        ctx.$api.api({a: 3, fail: spyFail}).then(
            spyResolve, spyReject
        );

        setTimeout(() => {
            let resErrInfo = 'err233666';
            expect(spyFail).toHaveBeenCalledWith(resErrInfo);
            assert(spyFail.calls.length === 1);

            assert(spyApi.calls.length === 1);
            expect(Object.keys(spyApi.calls[0].arguments[0])).toEqual([
                'a', 'fail', 'success'
            ]);

            expect(spyApiDone).toHaveBeenCalled();
            assert(spyApiDone.calls.length === 1);
            expect(spyApiDone.calls[0].arguments).toEqual(['err233', null, ctx]);

            expect(spyReject).toHaveBeenCalledWith(resErrInfo);
            assert(spyReject.calls.length === 1);
            expect(spyResolve).toNotHaveBeenCalled();

            done();
        }, 10);
    });

    it('should not reject when not throw exception in done callback', function (done) {
        let ctx = {
            $api: {
                api(opts) {
                    let err = 'err233';
                    setTimeout(() => {
                        opts.fail && opts.fail(err);
                        opts.complete && opts.complete(err);
                    });
                }
            }
        };

        ctx.$api.api = promisify(ctx.$api.api);

        let interceptConf = {
            api: {
                done(err, data) {
                    if (err) {
                        return 'catch';
                    }
                    return data + '666';
                }
            }
        };

        let spyApi = spyOn(ctx.$api, 'api').andCallThrough();
        let spyApiDone = spyOn(interceptConf.api, 'done').andCallThrough();

        interceptApis(interceptConf, '$api', ctx);

        let spyResolve = createSpy(() => {}).andCallThrough();
        let spyReject = createSpy(() => {}).andCallThrough();
        let spyFail = createSpy(() => {}).andCallThrough();
        ctx.$api.api({a: 3, fail: spyFail}).then(
            spyResolve, spyReject
        );

        setTimeout(() => {
            let resErrInfo = 'catch';
            assert(spyFail.calls.length === 1);
            expect(spyFail).toHaveBeenCalledWith(resErrInfo);

            assert(spyApi.calls.length === 1);
            expect(Object.keys(spyApi.calls[0].arguments[0])).toEqual([
                'a', 'fail', 'success'
            ]);

            expect(spyApiDone).toHaveBeenCalled();
            assert(spyApiDone.calls.length === 1);
            expect(spyApiDone.calls[0].arguments).toEqual(['err233', null, ctx]);

            expect(spyReject).toNotHaveBeenCalled();
            expect(spyResolve).toHaveBeenCalledWith(resErrInfo);
            assert(spyResolve.calls.length === 1);

            done();
        }, 10);
    });

    it('should not intercept success callback when specified sync true', function (done) {
        let ctx = {
            $api: {
                api(opts) {
                    setTimeout(() => {
                        opts.success && opts.success('ok');
                        opts.complete && opts.complete('ok');
                    });
                }
            }
        };

        let interceptConf = {
            api: {
                sync: true,
                done(err, data) {
                    return '666';
                }
            }
        };

        let spyApi = spyOn(ctx.$api, 'api').andCallThrough();
        let spyApiDone = spyOn(interceptConf.api, 'done').andCallThrough();

        interceptApis(interceptConf, '$api', ctx);

        let spySuccess = createSpy(() => {}).andCallThrough();
        let result = ctx.$api.api({a: 1, success: spySuccess});
        assert(result === '666');

        setTimeout(() => {
            expect(spySuccess).toHaveBeenCalledWith('ok');
            assert(spySuccess.calls.length === 1);

            assert(spyApi.calls.length === 1);
            expect(Object.keys(spyApi.calls[0].arguments[0])).toEqual([
                'a', 'success'
            ]);

            expect(spyApiDone).toHaveBeenCalled();
            assert(spyApiDone.calls.length === 1);
            expect(spyApiDone.calls[0].arguments).toEqual([null, undefined, ctx]);

            done();
        }, 10);

    });

    it('should waiting for init hook done when init hook return promise', function (done) {
        let ctx = {
            $api: {
                api(opts) {
                    let err = 'err233';
                    setTimeout(() => {
                        opts.fail && opts.fail(err);
                        opts.complete && opts.complete(err);
                    });
                }
            }
        };

        ctx.$api.api = promisify(ctx.$api.api);

        let interceptConf = {
            api: {
                init(options) {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            options.a = 6;
                            options.b = true;
                            resolve();
                        });
                    });
                },
                done(err, data) {
                    if (err) {
                        return 'catch';
                    }
                    return data + '666';
                }
            }
        };

        let spyApi = spyOn(ctx.$api, 'api').andCallThrough();
        let spyApiDone = spyOn(interceptConf.api, 'done').andCallThrough();

        interceptApis(interceptConf, '$api', ctx);

        let spyResolve = createSpy(() => {}).andCallThrough();
        let spyReject = createSpy(() => {}).andCallThrough();
        let spyFail = createSpy(() => {}).andCallThrough();
        ctx.$api.api({a: 3, fail: spyFail}).then(
            spyResolve, spyReject
        );

        setTimeout(() => {
            assert(spyApi.calls.length === 1);
            let args = spyApi.calls[0].arguments;
            assert(args.length === 1);

            let expectedKeys = ['a', 'b', 'fail', 'success'];
            Object.keys(args[0]).forEach(k => assert(expectedKeys.includes(k)));
            assert(args[0].a === 6);
            assert(args[0].b === true);

            let resErrInfo = 'catch';
            assert(spyFail.calls.length === 1);
            expect(spyFail).toHaveBeenCalledWith(resErrInfo);

            expect(spyApiDone).toHaveBeenCalled();
            assert(spyApiDone.calls.length === 1);
            expect(spyApiDone.calls[0].arguments).toEqual(['err233', null, ctx]);

            expect(spyReject).toNotHaveBeenCalled();
            expect(spyResolve).toHaveBeenCalledWith(resErrInfo);
            assert(spyResolve.calls.length === 1);

            done();
        }, 10);
    });

});
