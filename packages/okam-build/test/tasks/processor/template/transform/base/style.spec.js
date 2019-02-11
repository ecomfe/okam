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

    it('should support new line for object style binding syntax', function () {
        const file = {
            content: '<div style="height:10px" :style="{ color: colorStyle, \r\nfontSize: fontStyle + \'px\' }"></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content,
            '<view style="height:10px;color:{{colorStyle}};font-size:{{fontStyle + \'px\'}}"></view>');
    });

    it('should support style binding syntax which contains ternary expression', function () {
        const file = {
            content: '<div :style="{height: flag === \'true\' || flag === true ? height + \'px\' : \'20px\', width: flag ? \'10px\' : \'30px\'}"></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content,
            '<view style="height:{{flag === \'true\' || flag === true ? height + \'px\' : \'20px\'}};width:{{flag ? \'10px\' : \'30px\'}}"></view>');
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

    it('should support object abbrev style binding syntax', function () {
        const file = {
            content: '<div :style="{height, fontSize}"></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content,
            '<view style="height:{{height}};font-size:{{fontSize}}"></view>');
    });

    it('should support transform style binding syntax with comma', function () {
        const file = {
            content: '<div :style="{ transform: \'translate(-50%, -50%) rotate(\' + preview.rotate + \'deg)\', fontSize, \'font-size\': \'12px\' }"></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(
            result.content,
            '<view style="transform:{{\'translate(-50%, -50%) rotate(\' + preview.rotate + \'deg)\'}};font-size:{{fontSize}};\'font-size\':{{\'12px\'}}"></view>'
        );
    });

    it('should support es6 template string style binding', function () {
        const file = {
            content: '<div :style="{fontSize: `${fontSize}px`, width}"></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(
            result.content,
            '<view style="font-size:{{\'\' + fontSize + \'px\'}};width:{{width}}"></view>'
        );
    });
});
