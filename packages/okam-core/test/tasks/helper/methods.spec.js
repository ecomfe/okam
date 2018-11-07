/**
 * @file Methods normalize helper test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

import assert from 'assert';
import expect, {createSpy} from 'expect';
import {normalizeExtendProp, normalizeMethods} from 'core/helper/methods';

describe('Methods normalizer', function () {
    it('normalizeExtendProp', () => {
        let component = {
            a: '2'
        };
        normalizeExtendProp(component, 'a', '$a', true);

        assert(component.$a === '2');
        assert(component.a === undefined);

        component = {
            a: '2',
            methods: {
                b() {}
            }
        };
        normalizeExtendProp(component, 'a', '$a', false);

        assert(typeof component.methods.$a === 'function');
        expect(Object.keys(component.methods)).toEqual(['b', '$a']);
        assert(component.methods.$a() === '2');
        assert(component.a === undefined);

        component = {
            a: '2'
        };
        normalizeExtendProp(component, 'a', '$a', false);

        assert(typeof component.methods.$a === 'function');
        assert(component.methods.$a() === '2');
        assert(component.a === undefined);
    });

    it('normalizeMethods', function () {
        const extendMethods = [
            'beforeCreate',
            'beforeMount', 'mounted',
            'beforeDestroy', 'destroyed',
            'beforeUpdate', 'updated'
        ];

        let components = {};
        let extendMethodsMap = {};
        extendMethods.forEach(k => {
            let func = () => {};
            extendMethodsMap[k] = func;
            components[k] = func;
        });
        normalizeMethods(components);

        expect(Object.keys(components.methods)).toEqual(extendMethods);
        Object.keys(components.methods).forEach(k => {
            assert(components.methods[k] === extendMethodsMap[k]);
        });

        let hiSpy = createSpy(() => {});
        components = {
            hi: hiSpy,
            cc: 66
        };
        extendMethodsMap = {};
        extendMethods.forEach(k => {
            let func = () => {};
            extendMethodsMap[k] = func;
            components[k] = func;
        });
        normalizeMethods(components, ['hi', 'abc', 'cc']);

        expect(Object.keys(components.methods)).toEqual([].concat(extendMethods, 'hi', 'cc'));
        Object.keys(components.methods).forEach(k => {
            if (k === 'hi') {
                assert(components.methods[k] === hiSpy);
            }
            else if (k === 'cc') {
                assert(components.methods[k]() === 66);
            }
            else {
                assert(components.methods[k] === extendMethodsMap[k]);
            }
        });
    });
});
