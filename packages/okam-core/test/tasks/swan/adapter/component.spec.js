/**
 * @file Swan adapter test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

import assert from 'assert';
import expect, {createSpy} from 'expect';
import componentAdapter from 'core/swan/adapter/component';

describe('Swan component adapter', function () {
    it('should add emit API', () => {
        let component = {
        };
        componentAdapter(component);

        assert(typeof component.methods.$emit === 'function');

        let spyTriggerEvent = createSpy(() => {});
        component.methods.triggerEvent = spyTriggerEvent;
        component.methods.$emit('abc', {a: 3});
        expect(spyTriggerEvent).toHaveBeenCalled();
        assert(spyTriggerEvent.calls.length === 1);
        assert(spyTriggerEvent.calls[0].arguments[0] === 'abc');
        expect(spyTriggerEvent.calls[0].arguments[1]).toEqual({
            type: 'abc',
            currentTarget: {
                dataset: {},
                id: undefined
            },
            target: {
                dataset: {},
                id: undefined
            },
            detail: {
                a: 3
            }
        });
    });

    it('should trigger event when none detail data', function () {
        let component = {
        };
        componentAdapter(component);

        let spyTriggerEvent = createSpy(() => {});
        component.methods.triggerEvent = spyTriggerEvent;
        component.methods.$emit('test');
        expect(spyTriggerEvent).toHaveBeenCalled();
        assert(spyTriggerEvent.calls.length === 1);
        assert(spyTriggerEvent.calls[0].arguments[0] === 'test');
        expect(spyTriggerEvent.calls[0].arguments[1]).toEqual({
            type: 'test',
            currentTarget: {
                dataset: {},
                id: undefined
            },
            target: {
                dataset: {},
                id: undefined
            },
            detail: {}
        });
    });

    it('should not override $emit API if existed in component context', function () {
        let spyEmit = createSpy(() => {});
        let component = {
            methods: {
                $emit: spyEmit
            }
        };
        componentAdapter(component);

        assert(component.methods.$emit === spyEmit);
    });
});
