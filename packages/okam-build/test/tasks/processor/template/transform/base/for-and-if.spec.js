/**
 * @file The template processor test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

const assert = require('assert');
const {readFile, fakeProcessorOptions} = require('test/helper');
const templateProcessor = require('okam/processor/template/index');

function readTpl(file, isExpect) {
    return readFile(
        `for-and-if/${file}`
        + (isExpect ? '.expect' : '')
        + '.tpl'
    );
}

describe('for and if', function () {
    it('should split for-if to two tang', function () {
        const file = {
            content: readTpl('for-and-if')
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content, readTpl('for-and-if', true));
    });
});
