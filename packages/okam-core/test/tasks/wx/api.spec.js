/**
 * @file wx api test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global wx:false */

import assert from 'assert';
import expect from 'expect';
import api from 'core/wx/api';
import * as extendOkamAPI from 'core/na/platform';

describe('wx/api', () => {
    it('should export wx native env api', () => {
        expect(api.okam).toEqual(extendOkamAPI);
        Object.keys(wx).forEach(k => {
            assert(wx[k] === api[k]);
        });
    });
});
