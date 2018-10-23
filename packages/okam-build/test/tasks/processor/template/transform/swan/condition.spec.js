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
        `condition/${file}`
        + (isExpect ? '.expect' : '')
        + '.tpl'
    );
}

describe('condition rendering', function () {
    it('should transform if to s-if, elif/else-if to s-else-if,  else to s-else', function () {
        let file = {
            content: readTpl('condition')
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content, readTpl('condition', true));
    });

    it('有重复属性时，给出警告并保留okam语法的键值', function () {
        const file = {
            path: 'condition.tpl',
            content: '<div class="hello" s-if="hello" if="hi"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view class="hello" s-if="hi"></view>');
    });
});
