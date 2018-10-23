/**
 * @file The template processor test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

const assert = require('assert');
const {fakeProcessorOptions} = require('test/helper');
const templateProcessor = require('okam/processor/template/index');

describe('for rendering', function () {

    it('should transform for to s-for', function () {
        const file = {
            content: '<div class="hello" for="[1,2,3]"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view class="hello" s-for="[1,2,3]"></view>');
    });

    it('有重复属性时，给出警告并保留okam语法的键值', function () {
        const file = {
            path: 'for.tpl',
            content: '<div class="hello" s-for="[4,5,6]" for="[1,2,3]"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view class="hello" s-for="[1,2,3]"></view>');
    });

    it('should remove () in for', function () {
        const file = {
            content: '<view class="hello" for="(item,index) in [1,2,3]"></view>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view class="hello" s-for="item,index in [1,2,3]"></view>');
    });

    it('should transform number to array', function () {
        const file = {
            content: '<view class="hello" for="(item,index) in  5  "></view>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view class="hello" s-for="item,index in  [1,2,3,4,5]"></view>');
    });

    it('should transform of to in', function () {
        const file = {
            content: '<view class="hello" for="(item,index) of  [\'of\',2]  "></view>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view class="hello" s-for="item,index in  [\'of\',2]"></view>');
    });
});
