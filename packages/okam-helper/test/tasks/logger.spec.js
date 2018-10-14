/**
 * @file Logger test case
 * @author sparklewhy@gmail.com
 */

'use strict';

const logger = require('../../lib/logger');
const assert = require('assert');

describe('Logger', () => {
    it('should contain create API', () => {
        assert(typeof logger.create === 'function');
    });
});
