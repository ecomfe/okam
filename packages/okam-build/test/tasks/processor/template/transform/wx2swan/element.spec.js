/**
 * @file The template processor test spec
 *
 * @author xiaohong8023@outlook.com
 */

'use strict';

const assert = require('assert');
const {readFile, fakeProcessorOptions} = require('test/helper');
const viewProcessor = require('okam/processor/template/index');
const syntax = require('okam/processor/template/plugins/wx2swan-syntax-plugin.js');


function readTpl(file, isExpect) {
    return readFile(
        `template/${file}`
        + (isExpect ? '.expect' : '')
        + (isExpect ? '.swan' : '.wxml')
    );
}

describe('wx2swan element tranform', function () {
    it('should wx: to s-', function () {
        const file = {
            extname: 'wxml',
            content: readTpl('element')
        };
        let result = viewProcessor(file, fakeProcessorOptions(null, [syntax]));
        assert.equal(result.content, readTpl('element', true));
    });
});
