/**
 * @file Wx Component test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */
/* eslint-disable fecs-min-vars-per-destructure */

import assert from 'assert';
import expect from 'expect';
import base from 'core/base/base';
import component from 'core/base/component';
import {clearBaseCache} from 'core/helper/factory';
import {testCallOrder, fakeWxComponent, fakeAppEnvAPIs} from 'test/helper';

describe('wx/Component', () => {
    let MyComponent;
    let restoreAppEnv;

    beforeEach('init global App', function () {
        clearBaseCache();

        MyComponent = fakeWxComponent();
        restoreAppEnv = fakeAppEnvAPIs('wx');
    });

    afterEach('clear global App', function () {
        MyComponent = undefined;
        restoreAppEnv();
        expect.restoreSpies();
    });

    it('should inherit base api', () => {
        let componentInstance = {};
        let component = MyComponent(componentInstance);
        component.created();

        Object.keys(base).forEach(k => {
            assert(component[k] === base[k]);
        });
    });

    it('should call base created/attached/ready/detached in order', () => {
        const componentInstance = {
            created() {},
            attached() {},
            ready() {},
            detached() {}
        };
        testCallOrder(
            ['created', 'attached', 'ready', 'detached'],
            componentInstance,
            MyComponent,
            [component]
        );
    });

});
