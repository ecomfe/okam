/**
 * @file The babel parser helper test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

const assert = require('assert');
const {parse: parse7} = require('@babel/parser');
const {parse: parse6} = require('babylon');
const babel7Types = require('@babel/types');
const babel6Types = require('babel-types');
const babel7Traverse = require('@babel/traverse').default;
const babel6Traverse = require('babel-traverse').default;
const {readFile, writeFile} = require('test/helper');
const {generateCode} = require('okam/processor/js/transform/filter');

describe('filter transform', function () {

    it('should generate filter code using babel6', function () {
        const code = readFile('filters/test.js');
        const expectedCode = readFile('filters/test.babel6.expect');
        const ast = parse6(code, {
            sourceType: 'module'
        });
        babel6Traverse(ast, {
            ObjectProperty(path) {
                let prop = path.node;
                let key = prop.key;
                let keyName = key && key.name;
                if (keyName === 'filters') {
                    let code = generateCode(
                        prop.value, babel6Types,
                        {format: 'commonjs', usingBabel6: true}
                    );
                    assert.equal(code, expectedCode);
                    path.skip();
                }
            }
        });
    });

    it('should generate code using babel7', function () {
        const code = readFile('filters/test.js');
        const expectedCode = readFile('filters/test.babel7.expect');
        const ast = parse7(code, {
            sourceType: 'module'
        });
        babel7Traverse(ast, {
            ObjectProperty(path) {
                let prop = path.node;
                let key = prop.key;
                let keyName = key && key.name;
                if (keyName === 'filters') {
                    let code = generateCode(
                        prop.value, babel7Types,
                        {format: 'es6'}
                    );
                    assert.equal(code, expectedCode);
                    path.skip();
                }
            }
        });
    });
});
