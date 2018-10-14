/**
 * @file The template processor test spec
 * both for and condition
 *
 * @author xiaohong8023@outlook.com
 */

'use strict';

const assert = require('assert');
const {readFile, fakeProcessorOptions} = require('../../../helper');
const wx2swanProcessor = require('../../../../../lib/processor/wx2swan/index');
const syntax = require('../../../../../lib/template/transform/wx2swan-syntax-plugin.js');

function readTpl(file, isExpect) {
    return readFile(
        `for-and-if/${file}`
        + (isExpect ? '.expect' : '')
        + (isExpect ? '.swan' : '.wxml')
    );
}

describe('wx2swan for and if', function () {
    it('should split for-if to two tang', function () {
        const file = {
            extname: 'wxml',
            content: readTpl('wx2swan')
        };
        let result = wx2swanProcessor(file, fakeProcessorOptions([syntax]));
        assert.equal(result.content, readTpl('wx2swan', true));
    });
});
