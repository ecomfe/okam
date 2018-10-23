/**
 * @file The template processor test spec
 * both for and condition
 *
 * @author xiaohong8023@outlook.com
 */

'use strict';

const assert = require('assert');
const {readFile, fakeProcessorOptions} = require('test/helper');
const viewProcessor = require('okam/processor/template/index');
const syntax = require('okam/processor/template/plugins/wx2swan-syntax-plugin.js');

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
        let result = viewProcessor(file, fakeProcessorOptions(null, [syntax]));
        assert.equal(result.content, readTpl('wx2swan', true));
    });
});
