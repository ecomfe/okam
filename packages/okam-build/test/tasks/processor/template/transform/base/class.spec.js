/**
 * @file The template processor test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

const assert = require('assert');
const {fakeProcessorOptions} = require('test/helper');
const templateProcessor = require('okam/processor/template/index');

describe('class binding', function () {
    it('should transform class-data-binding', function () {
        const file = {
            content: '<p :class="activeClass"></p>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content, '<view class="{{activeClass}}"></view>');
    });

    it('should transform class-data-binding with object syntax', function () {
        const file = {
            content: '<p :class="{ active: isActive }"></p>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view class="{{[isActive?\'active\':\'\']}}"></view>');
    });

    it('should transform class-data-binding with static class', function () {
        const file = {
            content: '<p class="static" :class="{ active: isActive }"></p>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view class="static {{[isActive?\'active\':\'\']}}"></view>');
    });

    it('should transform class-data-binding with object that has two type key ', function () {
        const file = {
            content: '<p class="static" :class="{ active: isActive, \'text-danger\': hasError }"></p>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view '
            + 'class="static {{[isActive?\'active\':\'\',hasError?\'text-danger\':\'\']}}"></view>');
    });

    it('should transform class-data-binding with array syntax', function () {
        const file = {
            content: '<p class="static" :class="[activeClass, errorClass]"></p>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view class="static {{[activeClass,errorClass]}}"></view>');
    });

    it('should transform class-data-binding with array that has condition-expression', function () {
        const file = {
            content: '<p class="static" :class="[isActive ? activeClass : \'\', errorClass]"></p>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view class="static {{[isActive?activeClass:\'\',errorClass]}}"></view>');
    });

    it('should transform class-data-binding with array that has object', function () {
        const file = {
            content: '<p class="static" :class="[{ active: isActive }, errorClass]"></p>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view class="static {{[isActive?\'active\':\'\',errorClass]}}"></view>');
    });
});
