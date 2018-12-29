/**
 * @file swan api test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global swan:false */

import assert from 'assert';
import api from 'core/swan/api';

describe('swan/api', () => {
    it('should export swan native env api', () => {
        Object.keys(swan).forEach(k => {
            assert(swan[k] === api[k]);
        });
    });
});
