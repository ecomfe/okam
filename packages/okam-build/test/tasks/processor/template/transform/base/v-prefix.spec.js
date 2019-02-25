/**
 * @file v-model support
 * @author xiaohong8023@outlook.com
 */

'use strict';

const assert = require('assert');
const {readFile, fakeProcessorOptions} = require('test/helper');
const templateProcessor = require('okam/processor/template/index');

function readTpl(file, isExpect) {
    return readFile(
        file
        + (isExpect ? '.expect' : '')
        + '.tpl'
    );
}

describe('template processor: v- prefix plugin of template', function () {
    it('v- prefix: dynamic attr', function () {
        const file = {
            content: '<div :class="backButton" v-bind:data="data"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view class="{{backButton}}" data="{{data}}"></view>');
    });

    it('v- prefix: condition', function () {
        let file = {
            content: readTpl('condition/v-condition')
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content, readTpl('condition/v-condition', true));
    });

    it('v- prefix: for', function () {
        let file = {
            content: readTpl('for/v-for')
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content, readTpl('for/v-for', true));
    });

    it('v- prefix: event', function () {
        let file = {
            content: '<div @click="backButton" v-on:touch="touch"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content, '<view bindtap="__handlerProxy" data-tap-proxy="backButton" bindtouch="__handlerProxy" data-touch-proxy="touch"></view>');
    });

    it('v- prefix: not support directives', function () {
        const file = {
            path: 'test/fakefile',
            content: '<div v-html="backButton" v-model="data" v-show="false"></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<rich-text v-model="data" v-show="false" nodes="{{backButton}}"></rich-text>');
    });
});
