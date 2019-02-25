/**
 * @file v-html support
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

describe('template processor: v-html plugin of template', function () {

    it('v-html: rich-text', function () {
        let file = {
            content: readTpl('vhtml/vhtml')
        };
        let result = templateProcessor(file, fakeProcessorOptions(undefined, undefined));
        assert.equal(result.content, readTpl('vhtml/vhtml', true));
    });
});
