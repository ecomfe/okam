/**
 * @file The template processor test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

const assert = require('assert');
const {fakeProcessorOptions} = require('test/helper');
const templateProcessor = require('okam/processor/template/index');

describe('data-binding', function () {
    it('should transform colon to Mustache', function () {
        const file = {
            content: '<div :class="hello" :style="world" :id="bye"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content, '<view class="{{hello}}" style="{{world}}" id="{{bye}}"></view>');
    });

    it('有重复属性时，给出警告并保留okam语法的键值', function () {
        const file = {
            content: '<div :class="hello" :style="world" :id="bye" id="2"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view id="{{bye}}" class="{{hello}}" style="{{world}}"></view>');
    });
});
