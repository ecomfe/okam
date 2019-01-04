/**
 * @file Ant ref support test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */

import assert from 'assert';
import expect from 'expect';
import MyApp from 'core/swan/App';
import MyPage from 'core/swan/Page';
import {clearBaseCache} from 'core/helper/factory';
import ref from 'core/extend/ref/ant';
import {fakeAntComponent, fakeAppEnvAPIs} from 'test/helper';

describe('ref plugin', function () {
    let MyComponent;
    let restoreAppEnv;

    beforeEach('init global App', function () {
        clearBaseCache();

        MyComponent = fakeAntComponent();
        restoreAppEnv = fakeAppEnvAPIs('ant');
    });

    afterEach('clear global App', function () {
        MyComponent = undefined;
        restoreAppEnv();

        expect.restoreSpies();
    });

    it('should support refs in page', () => {
        MyApp.use(ref);

        let refInfo = {a: '.xx-a', b: '.xx-b', c: ['.xx-c'], d: ['.xx-d']};
        let fakeComponentA = {};
        let fakeComponentDArr = [{}];
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

                assert(this.$refs.a === fakeComponentA);
                assert(this.$refs.b === undefined);
                expect(this.$refs.c).toEqual([]);
                assert(this.$refs.d === fakeComponentDArr);

            }
        }, {refs: refInfo});

        page.__refComponents = {
            [refInfo.a]: fakeComponentA,
            ['[]' + refInfo.d]: fakeComponentDArr
        };
        page.onLoad();
        page.onReady();

        assert(page.$rawRefData === refInfo);
    });

    it('should support refs in component', () => {
        MyApp.use(ref);

        let refInfo = {
            a: '.xx-a',
            b: '.xx-b',
            d: ['.xx-d'],
            e: ['.notExist-e']
        };
        let fakeComponentA = {};
        let fakeComponentDArr = [{}];
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

                assert(this.$refs.a === fakeComponentA);
                assert(this.$refs.b === undefined);
                assert(this.$refs.d === fakeComponentDArr);
                expect(this.$refs.e).toEqual([]);
            }
        }, {refs: refInfo});

        instance.$page = {
            __refComponents: {
                [refInfo.a]: fakeComponentA,
                ['[]' + refInfo.d]: fakeComponentDArr
            }
        };

        assert(typeof instance.methods.$rawRefData === 'function');
        instance.didMount();

        expect(instance.$rawRefData()).toEqual(refInfo);
    });

    it('should support none reference info provided', () => {
        MyApp.use(ref);

        let instance = MyComponent({});
        instance.didMount();

        expect(instance.$refs).toEqual({});
    });

    it('should remove destroyed component ref in page', () => {
        MyApp.use(ref);

        let refInfo = {a: '.xx-a', b: '.xx-b', c: ['.xx-c'], d: ['.xx-d']};
        let fakeComponentA = {};
        let fakeComponentDArr = [{}];
        let page = MyPage({
            destroyed() {
            }
        }, {refs: refInfo});

        page.__refComponents = {
            [refInfo.a]: fakeComponentA,
            ['[]' + refInfo.d]: fakeComponentDArr
        };
        page.onLoad();
        page.onReady();
        page.onUnload();

        assert(page.__refComponents == null);
        assert(page.$refs == null);
    });

    it('should remove destroyed component ref in component', () => {
        MyApp.use(ref);

        let refInfo = {a: '.xx-a', b: '.xx-b', c: ['.xx-c'], d: ['.xx-d']};
        let fakeComponentA = {};
        let fakeComponentDArr = [{}];
        let instance = MyComponent({
            destroyed() {
            }
        }, {refs: refInfo});

        instance.$page = {
            __refComponents: {
                [refInfo.a]: fakeComponentA,
                ['[]' + refInfo.d]: fakeComponentDArr
            }
        };

        instance.props = {'data-okam-ref': '.xx-a'};
        instance.$refs = {};
        instance.didMount();
        instance.didUnmount();

        assert(instance.$page.__refComponents[refInfo.a] == null);
        assert(instance.$refs == null);
    });

    it('should remove destroyed component in ref array in component', () => {
        MyApp.use(ref);

        let refInfo = {a: '.xx-a', b: '.xx-b', c: ['.xx-c'], d: ['.xx-d']};
        let fakeComponentA = {};
        let fakeComponentDArr = [];
        let instance = MyComponent({
            destroyed() {
            }
        }, {refs: refInfo});

        let multipleKey = '[]' + refInfo.d;
        instance.$page = {
            __refComponents: {
                [refInfo.a]: fakeComponentA,
                [multipleKey]: fakeComponentDArr
            }
        };

        instance.props = {'data-okam-ref': multipleKey};
        instance.didMount();
        assert(instance.$page.__refComponents[multipleKey].length === 1);

        instance.didUnmount();
        assert(instance.$page.__refComponents[multipleKey].length === 0);
    });

    it('should not remove any component in ref when none ref info', () => {
        MyApp.use(ref);

        let refInfo = {a: '.xx-a', b: '.xx-b', c: ['.xx-c'], d: ['.xx-d']};
        let fakeComponentA = {};
        let fakeComponentDArr = [];
        let instance = MyComponent({
            destroyed() {
            }
        }, {refs: refInfo});

        instance.$page = {
            __refComponents: {
                [refInfo.a]: fakeComponentA,
                ['[]' + refInfo.d]: fakeComponentDArr
            }
        };

        let refComponents = {'.xx-a': {}, '[].xx-d': []};
        instance.didMount();
        expect(instance.$page.__refComponents).toEqual(refComponents);

        instance.didUnmount();
        expect(instance.$page.__refComponents).toEqual(refComponents);
    });

    it('should do nothing when ref info is destroyed', () => {
        MyApp.use(ref);

        let refInfo = {a: '.xx-a', b: '.xx-b', c: ['.xx-c'], d: ['.xx-d']};
        let fakeComponentA = {};
        let fakeComponentDArr = [];
        let instance = MyComponent({
            destroyed() {
            }
        }, {refs: refInfo});

        instance.$page = {
            __refComponents: {
                [refInfo.a]: fakeComponentA,
                ['[]' + refInfo.d]: fakeComponentDArr
            }
        };
        instance.props = {'data-okam-ref': '[].xx-d'};
        instance.didMount();
        instance.$page.__refComponents = null;

        instance.didUnmount();
        expect(instance.$page.__refComponents == null);
    });

    it('should do nothing when ref component info is destroyed', () => {
        MyApp.use(ref);

        let refInfo = {a: '.xx-a', b: '.xx-b', c: ['.xx-c'], d: ['.xx-d']};
        let fakeComponentA = {};
        let fakeComponentDArr = [{}];
        let instance = MyComponent({
            destroyed() {
            }
        }, {refs: refInfo});

        instance.$page = {
            __refComponents: {
                [refInfo.a]: fakeComponentA,
                ['[]' + refInfo.d]: fakeComponentDArr
            }
        };
        instance.props = {'data-okam-ref': '[].xx-d'};
        instance.didMount();
        instance.$page.__refComponents['[]' + refInfo.d].pop();

        instance.didUnmount();
        expect(instance.$page.__refComponents['[]' + refInfo.d]).toEqual([{}]);
    });
});
