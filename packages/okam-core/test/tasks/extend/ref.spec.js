/**
 * @file Broadcast support test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */

import assert from 'assert';
import expect from 'expect';
import MyApp from 'core/App';
import MyPage from 'core/Page';
import {clearBaseCache} from 'core/helper/factory';
import ref from 'core/extend/ref';
import component from 'core/base/component';
import {fakeComponent, fakeAppEnvAPIs} from 'test/helper';

describe('ref plugin', function () {
    const rawSelectComponent = component.selectComponent;
    const rawSelectAllComponent = component.selectAllComponents;

    let MyComponent;
    let restoreAppEnv;

    beforeEach('init global App', function () {
        clearBaseCache();

        MyComponent = fakeComponent();
        restoreAppEnv = fakeAppEnvAPIs('swan');

        component.selectComponent = function (path) {
            if (path.indexOf('.notExist') === 0) {
                return null;
            }
            return 'c' + path;
        };

        component.selectAllComponents = function (path) {
            if (path.indexOf('.notExist') === 0) {
                return null;
            }
            return ['c' + path];
        };
    });

    afterEach('clear global App', function () {
        MyComponent = undefined;
        restoreAppEnv();

        component.selectComponent = rawSelectComponent;
        component.selectAllComponents = rawSelectAllComponent;

        expect.restoreSpies();
    });

    it('should support refs in page', () => {
        MyApp.use(ref);

        let refInfo = {a: 'xx-a', b: 'xx-b', c: ['xx-c']};
        let page = MyPage({
            beforeCreate() {
                assert(this.$refs == null);
            },
            created() {
                assert(this.$refs != null);
            },
            beforeMount() {
                assert(this.$refs != null);
            },
            mounted() {
                assert(this.$refs != null);

                assert(this.$refs.a === '.xx-a');
                assert(this.$refs.b === '.xx-b');
                expect(this.$refs.c).toEqual(['.xx-c']);

            }
        }, refInfo);
        page.onLoad();
        page.onReady();

        assert(page.$rawRefData === refInfo);
    });

    it('should support refs in component', () => {
        MyApp.use(ref);

        let refInfo = {
            a: 'xx-a',
            b: 'xx-b',
            c: 'notExist-c',
            d: ['xx-d'],
            e: ['notExist-e']
        };
        let instance = MyComponent({
            beforeCreate() {
                assert(this.$refs == null);
            },
            created() {
                assert(this.$refs != null);
            },
            beforeMount() {
                assert(this.$refs != null);
            },
            mounted() {
                assert(this.$refs != null);

                assert(this.$refs.a === 'c.xx-a');
                assert(this.$refs.b === 'c.xx-b');
                assert(this.$refs.c === '.notExist-c');
                expect(this.$refs.d).toEqual(['c.xx-d']);
                expect(this.$refs.e).toEqual(['.notExist-e']);
            }
        }, refInfo);

        assert(typeof instance.methods.$rawRefData === 'function');
        instance.created();
        instance.attached();
        instance.ready();

        expect(instance.$rawRefData()).toEqual(refInfo);
    });

    it('should support none reference info provided', () => {
        MyApp.use(ref);

        let instance = MyComponent({});
        instance.created();
        instance.attached();
        instance.ready();

        expect(instance.$refs).toEqual({});
    });
});
