/**
 * @file Test helper
 * @author sparklewhy@gmail.com
 */

'use strict';

import assert from 'assert';
import expect, {spyOn} from 'expect';
import CoreComponent from 'core/Component';

const PATH_PREFIX_REGEX = /^\w+\./;

function getPropertyValue(obj, path) {
    let parts = path.split('.');
    let length = parts.length;
    let result = obj;
    let parent = result;
    let newPath = path;
    parts.forEach((k, idx) => {
        if (idx < length - 1) {
            parent = parent[k];
            result = parent;
        }
        else {
            newPath = k;
            result = parent && parent[k];
        }

    });
    return {parent, value: result, path: newPath};
}

/**
 * Test the given methods are called by the expected order.
 * The order is expected that the parent method should be called before the child.
 *
 * @param {Array.<string>} methods the methods to test
 * @param {Object} instance the instance definition
 * @param {Function} instanceClass the instance class
 * @param {Array.<Object>} parents the parents of the instance
 * @return {Object} the created instance
 */
export function testCallOrder(methods, instance, instanceClass, parents) {
    let callOrders = {};
    let expectOrders = {};
    let spyers = {};

    parents = [].concat(parents, instance);
    methods.forEach(name => {
        callOrders[name] = [];
        expectOrders[name] = [];
        spyers[name] = [];

        parents.forEach((parentItem, idx) => {
            let {parent, value, path} = getPropertyValue(parentItem, name);
            if (!value) {
                return;
            }

            if (name !== path) {
                // for nested method the child method will override the parent mehtod
                expectOrders[name][0] = idx + 1;
            }
            else {
                expectOrders[name].push(idx + 1);
            }

            let spy = spyOn(parent, path)
                .andCall(() => callOrders[name].push(idx + 1));
            spy.spyName = name;
            spyers[name].push(spy);
        });
    });

    let testInstance = instanceClass(instance);
    methods.forEach(m => {
        m = m.replace(PATH_PREFIX_REGEX, '');
        testInstance[m] && testInstance[m]();
    });

    Object.keys(spyers).forEach(k => {
        let items = spyers[k];
        let isNestedMethod = PATH_PREFIX_REGEX.test(k);
        let len = items.length;
        items.forEach((s, idx) => {
            if (isNestedMethod && idx < len - 1) {
                expect(s).toNotHaveBeenCalled();
            }
            else {
                expect(s).toHaveBeenCalled();
            }
        });
    });

    Object.keys(callOrders).forEach(k => {
        assert(callOrders[k].join('') === expectOrders[k].join(''));
    });

    return testInstance;
}

export function isPromise(obj) {
    return Object.prototype.toString.call(obj) === '[object Promise]';
}

export function fakeComponent() {
    return function (...args) {
        /* eslint-disable babel/new-cap */
        let instance = CoreComponent(...args);
        Object.assign(instance, instance.methods);
        return instance;
    };
}
