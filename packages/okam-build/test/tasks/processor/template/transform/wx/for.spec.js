/**
 * @file The template processor test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */

const assert = require('assert');
const {fakeProcessorOptions} = require('test/helper');
const templateProcessor = require('okam/processor/template/index');

describe('微信：for rendering', function () {
    it('for -> wx:for，key为item时转化为微信关键字*this', function () {
        const file = {
            path: 'weixin fortpl',
            content: '<div class="hello" for="[1,2,3]" :key="item"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(undefined, undefined, 'wx'));
        assert.equal(result.content,
            '<view class="hello" wx:for="{{ [1,2,3] }}" wx:key="*this"></view>');
    });

    it('自定义当前元素和索引名称的for转换; key为自定义项目名时转化为微信关键字*this', function () {
        const file = {
            content: '<div class="hello" for="itemName,itemIndex in [1,2,3]" :key="itemName"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(undefined, undefined, 'wx'));
        assert.equal(result.content,
            '<view class="hello" wx:for="{{ [1,2,3] }}" wx:for-item="itemName" '
            + 'wx:for-index="itemIndex" wx:key="*this"></view>');
    });

    it('遍历对象数组时，key为对象的键值', function () {
        const file = {
            content: '<div class="hello" for="[{id: 0, unique: \'unique_0\'}]" :key="item.unique"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(undefined, undefined, 'wx'));
        assert.equal(result.content,
            '<view class="hello" wx:for="{{ [{id: 0, unique: \'unique_0\'}] }}" wx:key="unique"></view>');
    });

    it('for -> wx:for，key为无效的值，给出警告', function () {
        const file = {
            content: '<div class="hello" for="[1,2,3]" :key="hello.hi"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(undefined, undefined, 'wx'));
        assert.equal(result.content,
            '<view class="hello" wx:for="{{ [1,2,3] }}" wx:key="hello.hi"></view>');
    });

    it('有重复属性时，给出警告并保留okam语法的键值', function () {
        const file = {
            content: '<div class="hello" wx:for="[4,5,6]" for="[1,2,3]"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(undefined, undefined, 'wx'));
        assert.equal(result.content, '<view class="hello" wx:for="{{ [1,2,3] }}"></view>');
    });

    it('支持()的写法', function () {
        const file = {
            content: '<view class="hello" for="(item,index) in [1,2,3]"></view>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(undefined, undefined, 'wx'));
        assert.equal(result.content,
            '<view class="hello" wx:for="{{ [1,2,3] }}" wx:for-item="item" wx:for-index="index"></view>');
    });

    it('支持遍历数字（转化数字为数组）', function () {
        const file = {
            content: '<view class="hello" for="(item,index) in  5  "></view>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(undefined, undefined, 'wx'));
        assert.equal(result.content,
            '<view class="hello" wx:for="{{ [1,2,3,4,5] }}" wx:for-item="item" wx:for-index="index"></view>');
    });

    it('支持使用 of 遍历', function () {
        const file = {
            content: '<view class="hello" for="(item,index) of  [\'of\',2]  "></view>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(undefined, undefined, 'wx'));
        assert.equal(result.content,
            '<view class="hello" wx:for="{{ [\'of\',2] }}" wx:for-item="item" wx:for-index="index"></view>');
    });
});
