/**
 * @file The template processor test spec
 *
 * @author xiaohong8023@outlook.com
 */

'use strict';

const assert = require('assert');
const {readFile, fakeProcessorOptions} = require('../../../helper');
const wx2swanProcessor = require('../../../../../lib/processor/wx2swan/index');

const syntax = require('../../../../../lib/template/transform/wx2swan-syntax-plugin.js');


function readTpl(file, isExpect) {
    return readFile(
        `template/${file}`
        + (isExpect ? '.expect' : '')
        + (isExpect ? '.swan' : '.wxml')
    );
}

describe('wx2swan attribute tranform', function () {
    it('should wx: to s-', function () {
        const file = {
            extname: 'wxml',
            content: readTpl('attribute')
        };
        let result = wx2swanProcessor(file, fakeProcessorOptions([syntax]));
        assert.equal(result.content, readTpl('attribute', true));
    });
});
