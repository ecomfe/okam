/**
 * @file na/request test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

import expect, {spyOn} from 'expect';
import request from 'core/na/request';

describe('na/request', function () {
    const rawRequest = request.request;
    beforeEach('fake request api', () => {
        request.request = (...args) => Promise.resolve(args);
    });

    afterEach('restore request api', () => {
        request.request = rawRequest;
        expect.restoreSpies();
    });

    it('should fetch using default GET method', () => {
        let spyRequest = spyOn(request, 'request').andCallThrough();
        request.fetch('http://xxx');

        expect(spyRequest).toHaveBeenCalledWith({url: 'http://xxx', method: 'GET'});
    });

    it('should fetch using specified method', () => {
        let spyRequest = spyOn(request, 'request').andCallThrough();
        request.fetch('http://xxx', {method: 'put'});

        expect(spyRequest).toHaveBeenCalledWith({url: 'http://xxx', method: 'PUT'});
    });

    it('should get data using GET method', () => {
        let spyRequest = spyOn(request, 'request').andCallThrough();
        request.get('http://xxx', {method: 'put', data: {a: 3}});
        expect(spyRequest).toHaveBeenCalledWith({url: 'http://xxx', method: 'GET', data: {a: 3}});
    });

    it('should post data using post method', () => {
        let spyRequest = spyOn(request, 'request').andCallThrough();
        request.post('http://xxx', {method: 'put', data: {a: 3}});
        expect(spyRequest).toHaveBeenCalledWith({url: 'http://xxx', method: 'POST', data: {a: 3}});
    });
});
