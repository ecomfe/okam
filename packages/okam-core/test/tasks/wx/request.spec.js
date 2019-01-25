/**
 * @file wx request test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global before:false */
/* eslint-disable max-nested-callbacks */

import assert from 'assert';
import expect, {createSpy} from 'expect';
import requestInit, {setMaxRequestNumber} from 'core/wx/request';
import naRequest from 'core/na/request';

describe('wx/request', () => {
    let rawFakeRequest = global.fakeRequest;
    before(() => {
        requestInit();
    });

    afterEach('reset', function () {
        global.fakeRequest = rawFakeRequest;
    });

    it('should normal request', function (done) {
        let spyRequest = createSpy(options => {
            options.complete({a: 3});
            options.success({a: 6});
            options.fail({a: 1});
        }).andCallThrough();
        let spyFail = createSpy(() => {});
        let spySuccess = createSpy(() => {});
        let spyComplete = createSpy(() => {});
        global.fakeRequest = spyRequest;

        let reqOpts = {
            url: 'http://www.baidu.com',
            method: 'GET',
            fail: spyFail,
            success: spySuccess,
            complete: spyComplete
        };
        naRequest.request(reqOpts);

        setTimeout(() => {
            assert(spyRequest.calls.length === 1);
            let args = spyRequest.calls[0].arguments;
            assert(args.length === 1);

            let argInfo = args[0];
            assert(reqOpts.url === argInfo.url);
            assert(reqOpts.method === argInfo.method);
            assert(typeof reqOpts.complete === 'function');
            assert(typeof reqOpts.fail === 'function');
            assert(typeof reqOpts.success === 'function');

            expect(spyRequest).toHaveBeenCalled();

            assert(spyComplete.calls.length === 1);
            expect(spyComplete).toHaveBeenCalledWith({a: 3});

            assert(spySuccess.calls.length === 1);
            expect(spySuccess).toHaveBeenCalledWith({a: 6});

            assert(spyFail.calls.length === 1);
            expect(spyFail).toHaveBeenCalledWith({a: 1});

            done();
        });
    });

    it('should waiting the previous request done when request number exceeds the allow max number', function (done) {
        let url;
        let spyRequest = createSpy(options => {
            if (options.url === url) {
                setTimeout(() => {
                    options.complete();
                    options.success && options.success();
                });
            }
            else {
                setTimeout(() => {
                    options.complete();
                    options.success && options.success();
                }, 5);
            }
        }).andCallThrough();
        global.fakeRequest = spyRequest;

        setMaxRequestNumber(1);

        let spyComplete = createSpy(() => {});
        url = 'http://www.baidu.com';
        let reqOpts = {
            url,
            complete: spyComplete
        };
        naRequest.request(reqOpts);

        let spyComplete2 = createSpy(() => {});
        let url2 = 'http://www.baidu.com2';
        let reqOpts2 = {
            url: url2,
            complete: spyComplete2
        };
        naRequest.request(reqOpts2);

        expect(spyComplete).toNotHaveBeenCalled();
        expect(spyComplete2).toNotHaveBeenCalled();

        assert(spyRequest.calls.length === 1);
        expect(spyRequest).toHaveBeenCalled();

        setTimeout(() => {
            assert(spyRequest.calls.length === 2);
            expect(spyComplete).toHaveBeenCalled();

            setMaxRequestNumber(2);

            let spyRequest2 = createSpy(() => {});
            global.fakeRequest = spyRequest2;

            let spyComplete3 = createSpy(() => {});
            let url3 = 'http://www.baidu.com';
            let reqOpts3 = {
                url: url3,
                complete: spyComplete3
            };
            naRequest.request(reqOpts3);

            let spyComplete4 = createSpy(() => {});
            let url4 = 'http://www.baidu.com4';
            let reqOpts4 = {
                url: url4,
                complete: spyComplete4
            };
            naRequest.request(reqOpts4);

            expect(spyComplete3).toNotHaveBeenCalled();
            expect(spyComplete4).toNotHaveBeenCalled();

            assert(spyRequest2.calls.length === 2);

            done();
        }, 10);
    });
});
