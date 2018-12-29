/**
 * @file wx api test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global wx:false */

import assert from 'assert';
import api from 'core/wx/api';

describe('wx/api', () => {
    it('should export wx native env api', () => {
        Object.keys(wx).forEach(k => {
            assert(wx[k] === api[k]);
        });
    });
});
