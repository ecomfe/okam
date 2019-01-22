/**
 * @file The babel parser helper test spec
 * @author sparklewhy@gmail.com
 */

 /* eslint-disable max-len */
'use strict';

const assert = require('assert');
const {fakeProcessorOptions} = require('test/helper');
const templateProcessor = require('okam/processor/template/index');
const wxFilterPlugin = require('okam/processor/template/plugins/filter/wx-filter-plugin');
const swanFilterPlugin = require('okam/processor/template/plugins/filter/swan-filter-plugin');
const antFilterPlugin = require('okam/processor/template/plugins/filter/ant-filter-plugin');
const quickFilterPlugin = require('okam/processor/template/plugins/filter/quick-filter-plugin');

describe('template filter transform', function () {
    it('should ignore not filter value', function () {
        const file = {
            content: '<view data-attr="a|b">|ss</view>'
        };

        let opts = fakeProcessorOptions();
        opts.config.filter = {};
        let result = templateProcessor(file, opts);
        assert.equal(result.content, '<view data-attr="a|b">|ss</view>');
    });

    it('should convert swan filter value', function () {
        const file = {
            path: 'test.js',
            content: '<view :data-attr="a|b">{{ "abc" | toUpperCase }}</view>'
        };

        let opts = fakeProcessorOptions();
        opts.config.filter = {};
        opts.config.plugins.push([
            swanFilterPlugin, {filters: [{src: './a.filter.js', filters: ['b', 'toUpperCase']}]}
        ]);
        let result = templateProcessor(file, opts);
        assert.equal(result.content, '<filter src="./a.filter.js" module="f0"></filter><view data-attr="{{f0.b(a)}}">{{f0.toUpperCase("abc")}}</view>');
    });

    it('should convert wx filter value', function () {
        const file = {
            path: 'test.js',
            content: '<view :data-attr="a|b">{{ str|d| c}}</view>'
        };

        let opts = fakeProcessorOptions(null, null, 'wx');
        opts.config.filter = {};
        opts.config.plugins.push([
            wxFilterPlugin, {filters: [{src: './a.filter.js', filters: ['b', 'c', 'd']}]}
        ]);
        let result = templateProcessor(file, opts);
        assert.equal(result.content, '<wxs src="./a.filter.js" module="f0"></wxs><view data-attr="{{f0.b(a)}}">{{f0.c(f0.d(str))}}</view>');
    });

    it('should convert wx filter with filter args', function () {
        let file = {
            path: 'test.js',
            content: '<view :data-attr="a|b">{{ str|d| c(1)}}</view>'
        };

        let opts = fakeProcessorOptions(null, null, 'wx');
        opts.config.filter = {};
        opts.config.plugins.push([
            wxFilterPlugin, {filters: [{src: './a.wxs', filters: ['b', 'c', 'd']}]}
        ]);
        let result = templateProcessor(file, opts);
        assert.equal(result.content, '<wxs src="./a.wxs" module="f0"></wxs><view data-attr="{{f0.b(a)}}">{{f0.c(f0.d(str),1)}}</view>');

        file = {
            path: 'test2.js',
            content: '<view :s="a|b(\'str\', 2)">{{ str|c()}}</view>'
        };
        opts = fakeProcessorOptions(null, null, 'wx');
        opts.config.filter = {};
        opts.config.plugins.push([
            wxFilterPlugin, {filters: [{src: './a.wxs', filters: ['b', 'c']}]}
        ]);
        result = templateProcessor(file, opts);
        assert.equal(result.content, '<wxs src="./a.wxs" module="f0"></wxs><view s="{{f0.b(a,\'str\', 2)}}">{{f0.c(str)}}</view>');
    });

    it('should convert quick filter value', function () {
        const file = {
            path: 'test.js',
            content: '<div><view :data-attr="a|b">{{ str|d| c}}</view>'
                + '<view :style="size | b"></view>'
                + '<view :class="item | abc | efg(true, 2)"></view></div>'
        };

        let opts = fakeProcessorOptions(null, null, 'quick');
        opts.config.filter = {};
        opts.config.plugins.push([
            quickFilterPlugin, {filters: [{src: './a.filter.js', filters: ['b', 'c', 'd']}]}
        ]);

        let result = templateProcessor(file, opts);
        assert.equal(
            result.content,
            '<div><view data-attr="{{f_b(a)}}"><text>{{f_c(f_d(str))}}</text></view><view style="{{f_b(size)}}"></view><view class="{{efg(abc(item),true, 2)}}"></view></div>'
        );
    });

    it('should convert wx class/style filter value', function () {
        const file = {
            path: 'test.js',
            content: '<view :class="a|b" :style="item|c(\'prefix\')">abc</view>'
        };

        let opts = fakeProcessorOptions(null, null, 'wx');
        opts.config.filter = {};
        opts.config.plugins.push([
            wxFilterPlugin, {filters: [{src: './a.filter.js', filters: ['b', 'c', 'd']}]}
        ]);
        let result = templateProcessor(file, opts);
        assert.equal(
            result.content,
            '<wxs src="./a.filter.js" module="f0"></wxs><view class="{{f0.b(a)}}" style="{{f0.c(item,\'prefix\')}}">abc</view>'
        );
    });

    it('should convert swan class/style filter value', function () {
        const file = {
            path: 'test.js',
            content: '<view :class="a|b" :style="style|c()|b(efg, true)">abc</view>'
        };

        let opts = fakeProcessorOptions(null, null, 'swan');
        opts.config.filter = {};
        opts.config.plugins.push([
            swanFilterPlugin, {filters: [{src: './a.filter.js', filters: ['b', 'c', 'd']}]}
        ]);
        let result = templateProcessor(file, opts);
        assert.equal(
            result.content,
            '<filter src="./a.filter.js" module="f0"></filter><view class="{{f0.b(a)}}" style="{{f0.b(f0.c(style),efg, true)}}">abc</view>'
        );
    });

    it('should convert ant class/style filter value', function () {
        const file = {
            path: 'test.js',
            content: '<view :style="value |d(has ? 2 : true)" :class="a|b">abc</view>'
        };

        let opts = fakeProcessorOptions(null, null, 'ant');
        opts.config.filter = {};
        opts.config.plugins.push([
            antFilterPlugin, {filters: [{src: './a.filter.js', filters: ['b', 'c', 'd']}]}
        ]);
        let result = templateProcessor(file, opts);
        assert.equal(
            result.content,
            '<import-sjs from="./a.filter.js" name="f0"></import-sjs><view style="{{f0.d(value,has ? 2 : true)}}" class="{{f0.b(a)}}">abc</view>'
        );
    });
});
