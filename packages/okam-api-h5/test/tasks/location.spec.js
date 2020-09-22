/**
 * @file location api unit test
 * @author congpeisen <congpeisen@baidu.com>
 */

'use strict';

import LocationApi from 'api/location';
// import {strict as assert} from 'assert';
// import {expect} from 'chai';
import {expect, spy} from 'mochaccino';

const {
    getLocation
    // openLocation
} = LocationApi;

describe('[api-group]location', function () {
    it('api:getLocation', function () {
        let success = spy();
        let fail = spy();

        getLocation({
            success,
            fail
        }).then(res => {
            // expect(success).toHaveBeenCalled();
            expect(res).toHaveProperty('latitude');
            expect(res).toHaveProperty('longitude');
        }).catch(e => ({
            // expect(fail).toHaveBeenCalled();
        }));
    });
    it('api:openLocation', function (done) {
        done();
    });
});
