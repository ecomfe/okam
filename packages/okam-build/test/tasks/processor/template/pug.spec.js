/**
 * @file The pug processor test spec
 * @author asd123freedom@gmail.com
 */

'use strict';

const assert = require('assert');

const pugProcessor = require('okam/processor/template/pug');

describe('pug template processor', function () {

    it('should transfrom to html syntax', function () {
        let file = {
            content: 'view.test helloworld'
        };
        let fakeOption = {};
        let result = pugProcessor(file, fakeOption);
        assert(result.content === '\n<view class="test">helloworld</view>');
    });

    it('should compile pug template to html syntax', function () {
        let file = {
            content: 'view.test helloworld #{name}'
        };
        let fakeOption = {
            config: {
                data: {name: 'efe-blue'}
            }
        };
        let result = pugProcessor(file, fakeOption);
        assert(result.content === '\n<view class="test">helloworld efe-blue</view>');
    });

    it('should not alter swan syntax in template', function () {
        let template = 'view(class="second-view {{name}}", on-click="handleClick") {{title}}';

        let file = {
            content: template
        };
        let fakeOption = {};
        let result = pugProcessor(file, fakeOption);
        assert(result.content === '\n<view class="second-view {{name}}" on-click="handleClick">{{title}}</view>');
    });

    it('should not alter vue syntzx in template', function () {
        let template = 'view(class="second-view {{name}}", @click.stop="handleClick") {{title}}';

        let file = {
            content: template
        };
        let fakeOption = {};
        let result = pugProcessor(file, fakeOption);
        assert(result.content === '\n<view class="second-view {{name}}" @click.stop="handleClick">{{title}}</view>');
    });

    it('should compile in multiple line suitation', function () {
        let template
            = `view
                    view(
                        @click="handleClick",
                        class="first-view"
                    ) Hello world {{}}`;
        let file = {
            content: template
        };
        let fakeOption = {};
        let result = pugProcessor(file, fakeOption);
        /* eslint-disable max-len */
        assert(result.content === '\n<view>\n  <view class="first-view" @click="handleClick">Hello world {{}}</view>\n</view>');
    });
});
