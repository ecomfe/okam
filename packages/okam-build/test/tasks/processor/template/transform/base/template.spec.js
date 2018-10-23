/**
 * @file The template processor test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

const assert = require('assert');
const helper = require('test/helper');
const templateProcessor = require('okam/processor/template/index');

function getClassRemoveVisitor(visitorOpts) {
    visitorOpts || (visitorOpts = {});
    return function (type, opts) {
        return {
            tag(node, parent) {
                let attrs = node.attribs;
                if (attrs && attrs.class) {
                    delete attrs.class;
                }

                if (visitorOpts.skip) {
                    this.skip();
                }

                if (visitorOpts.stop) {
                    this.stop();
                }
            }
        };
    };
}

function getTemplateProcessOptions(visitorOpts) {

    const myPlugins = [
        getClassRemoveVisitor(visitorOpts)()
    ];

    return helper.fakeProcessorOptions({}, myPlugins);
}

describe('template processor', function () {
    let file = {
        content: '<view class="hello"><view class="hello2"></view></view><view class="hello3"></view>'
    };

    it('should remove class attribute', function () {
        let result = templateProcessor(file, getTemplateProcessOptions());
        assert(result.content === '<view><view></view></view><view></view>');
    });

    it('should skip children process', function () {
        let result = templateProcessor(file, getTemplateProcessOptions({skip: true}));
        assert(result.content === '<view><view class="hello2"></view></view><view></view>');
    });

    it('should stop the remain node process', function () {
        let result = templateProcessor(file, getTemplateProcessOptions({stop: true}));
        assert(result.content === '<view><view class="hello2"></view></view><view class="hello3"></view>');
    });
});
