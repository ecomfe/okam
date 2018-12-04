/**
 * @file swan api test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global swan:false */

import assert from 'assert';
import expect from 'expect';
import api from 'core/swan/api';
import * as extendOkamAPI from 'core/na/platform';

describe('swan/api', () => {
    it('should export swan native env api', () => {
        expect(api.okam).toEqual(extendOkamAPI);
        Object.keys(swan).forEach(k => {
            assert(swan[k] === api[k]);
        });
    });
});
