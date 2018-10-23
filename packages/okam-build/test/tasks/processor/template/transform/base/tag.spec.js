/**
 * @file The template processor test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

// 单测覆盖率未达到100%
// 1.无法构造node.attribs为undefine或者空的情况
// 2.异常：68行分支。实际已经覆盖到了，但是未计入统计。

const assert = require('assert');
const {fakeProcessorOptions} = require('test/helper');
const templateProcessor = require('okam/processor/template/index');

const transformTags = {
    view: ['div', 'p']
};

const tagsWithSpanObject = {
    view: ['div', 'p',
        {
            'tag': 'span',
            'class': 'okam-inline'
        }]
};

const tagsWithNavigator = {
    view: ['div', 'p'],
    navigator: {
        tag: 'a',
        href: 'url'
    },
    image: 'img'
};

const tagsWithWrongProps = {
    view: ['div', 'p'],
    navigator: {
        tag: 'a',
        href: {}
    },
    image: 'img'
};

describe('tag processor', function () {
    it('do nothing if there is not config', function () {
        const file = {
            content: '<div class="backButton"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions({}));
        assert(result.content === '<div class="backButton"></div>');
    });

    it('do nothing if the tag is not in tagMap', function () {
        const file = {
            content: '<view class="backButton"></view><code></code>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(transformTags));
        assert(result.content === '<view class="backButton"></view><code></code>');
    });

    it('transform tag', function () {
        const file = {
            content: '<div class="backButton"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(transformTags));
        assert(result.content === '<view class="backButton"></view>');
    });

    it('transform span with class', function () {
        const file = {
            content: '<span class="backButton"></span><span></span>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(tagsWithSpanObject));
        assert(result.content === '<view class="okam-inline backButton"></view><view class="okam-inline"></view>');
    });

    it('should transform tag a to navigator', function () {
        const file = {
            content: '<a class="backButton" href="/pages/home/index"></a>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(tagsWithNavigator));
        assert(result.content === '<navigator class="backButton" url="/pages/home/index"></navigator>');
    });

    it('log error if props are not string', function () {
        const file = {
            content: '<a class="backButton" href="/pages/home/index"></a>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(tagsWithWrongProps));
        assert(result.content === '<navigator class="backButton" href="/pages/home/index"></navigator>');
    });
});
