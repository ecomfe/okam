/**
 * @file The template processor test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable max-len */
const assert = require('assert');
const {fakeProcessorOptions} = require('test/helper');
const templateProcessor = require('okam/processor/template/index');

describe('style binding', function () {
    it('should transform style-data-binding with object（对象语法）', function () {
        const file = {
            content: '<div :style="{ color: colorStyle, fontSize: fontStyle + \'px\', fontFamily:\'Times New Roman\' }"></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content, '<view style="color:{{colorStyle}};font-size:{{fontStyle + \'px\'}};font-family:{{\'Times New Roman\'}}"></view>');
    });

    it('合并静态style和动态style', function () {
        const file = {
            content: '<div style="height:10px" :style="{ color: colorStyle, fontSize: fontStyle + \'px\' }"></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content,
            '<view style="height:10px;color:{{colorStyle}};font-size:{{fontStyle + \'px\'}}"></view>');
    });

    // 和对象语法走的同一个代码分支。转化的时候应避免内部[]被转化
    it('should transform style-data-binding with array that has object（数组语法）', function () {
        const file = {
            content: '<div :style="[{ color:colorStyle[item], fontSize:fontStyle + \'px\' },{fontWeight:\'bold\'}]"></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content,
            '<view style="color:{{colorStyle[item]}};font-size:{{fontStyle + \'px\'}};font-weight:{{\'bold\'}}"></view>');
    });
});
