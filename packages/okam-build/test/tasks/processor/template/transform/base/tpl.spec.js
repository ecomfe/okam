/**
 * @file template reference
 * @author sharonzd
 * @date 2018/9/7
 */

'use strict';

const assert = require('assert');
const {fakeProcessorOptions} = require('test/helper');
const templateProcessor = require('okam/processor/template/index');

describe('template reference', function () {
    it('should transform suffix of template when using import', function () {
        let file = {
            content: '<import src="../../common/tpl/footer.tpl"/>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content, '<import src="../../common/tpl/footer.swan"/>');
    });

    it('should transform suffix of template when using include', function () {
        let file = {
            content: '<include :from="from" src="../../common/tpl/include.tpl"/>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content, '<include src="../../common/tpl/include.swan" from="{{from}}"/>');
    });

    it('should transform include if there isn\'t src', function () {
        let file = {
            content: '<include :from="from"/>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content, '<include from="{{from}}"/>');
    });


    it('should transform tpl to template', function () {
        let file = {
            content: '<tpl is="page-footer" :copyRightDate="copyRightDate"/>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content, '<template is="page-footer" copyRightDate="{{copyRightDate}}"/>');
    });
});
