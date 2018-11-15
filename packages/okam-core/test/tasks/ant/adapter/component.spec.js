/**
 * @file Ant component adapter test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */
/* eslint-disable fecs-min-vars-per-destructure */

import assert from 'assert';
import expect, {createSpy, spyOn} from 'expect';
import adapter from 'core/ant/adapter/component';

describe('Ant component adapter', () => {

    it('should rewrite event handler', () => {
        let clickSpy = createSpy(() => {}).andCallThrough();
        let click2Spy = createSpy(() => {}).andCallThrough();
        let component = {
            props: {
                a: 2,
                onClick: clickSpy,
                onClick2: click2Spy
            }
        };

        adapter(component);

        expect(Object.keys(component.props)).toEqual(['a', 'onClick', 'onClick2']);
        assert(typeof component.didMount === 'function');
        assert(component.props.onClick === clickSpy);
        assert(component.props.onClick2 === click2Spy);

        component.didMount();

        expect(Object.keys(component.props)).toEqual(['a', 'onClick', 'onClick2']);
        assert(component.props.onClick !== clickSpy);
        assert(component.props.onClick2 !== click2Spy);

        const spyPropClick = spyOn(component.props, 'onClick').andCallThrough();

        component.props.onClick({a: 3});
        expect(clickSpy).toHaveBeenCalled();
        assert(clickSpy.calls.length === 1);
        expect(clickSpy.calls[0].arguments).toEqual([{
            type: 'click',
            currentTarget: {dataset: {}, id: undefined},
            target: {dataset: {}, id: undefined},
            detail: {a: 3}
        }]);
        expect(clickSpy.calls[0].context).toBe(component);

        expect(spyPropClick).toHaveBeenCalled();
        assert(spyPropClick.calls.length === 1);
        expect(spyPropClick.calls[0].arguments).toEqual([{a: 3}]);
        expect(spyPropClick.calls[0].context).toBe(component.props);
    });

    it('should retain existed didMount hook when adapt the component', () => {
        let clickSpy = createSpy(() => {}).andCallThrough();
        let spyDidMount = createSpy(() => {}).andCallThrough();
        let component = {
            props: {
                onClick: clickSpy
            },
            didMount: spyDidMount
        };

        adapter(component);

        component.didMount();
        assert(component.didMount !== spyDidMount);
        expect(spyDidMount).toHaveBeenCalled();
        assert(spyDidMount.calls.length === 1);
        expect(spyDidMount.calls[0].context).toBe(component);

        component.props.onClick({a: 3});
        expect(clickSpy).toHaveBeenCalled();
        assert(clickSpy.calls.length === 1);
        expect(clickSpy.calls[0].arguments).toEqual([{
            type: 'click',
            currentTarget: {dataset: {}, id: undefined},
            target: {dataset: {}, id: undefined},
            detail: {a: 3}
        }]);
        expect(clickSpy.calls[0].context).toBe(component);
    });

    it('should do nothing when no props', function () {
        let spyDidMount = createSpy(() => {}).andCallThrough();
        let component = {
            didMount: spyDidMount
        };

        adapter(component);

        assert(component.props === undefined);
        assert(component.didMount !== spyDidMount);

        component.didMount();

        expect(spyDidMount).toHaveBeenCalled();
        assert(spyDidMount.calls.length === 1);
        expect(spyDidMount.calls[0].context).toBe(component);
    });

    it('should ignore illegal event handler property', () => {
        let myFuncSpy = createSpy(() => {}).andCallThrough();
        let clickSpy = createSpy(() => {}).andCallThrough();
        let myOnSpy = createSpy(() => {}).andCallThrough();
        let onCSpy = createSpy(() => {}).andCallThrough();
        let component = {
            props: {
                myFunc: myFuncSpy,
                onclick: clickSpy,
                on: myOnSpy,
                onC: onCSpy
            }
        };

        adapter(component);

        expect(Object.keys(component.props)).toEqual(['myFunc', 'onclick', 'on', 'onC']);
        assert(typeof component.didMount === 'function');
        assert(component.props.myFunc === myFuncSpy);
        assert(component.props.onclick === clickSpy);

        component.didMount();

        expect(Object.keys(component.props)).toEqual(['myFunc', 'onclick', 'on', 'onC']);
        assert(component.props.onclick !== clickSpy);
        assert(component.props.myFunc === myFuncSpy);
        assert(component.props.on === myOnSpy);
        assert(component.props.onC !== onCSpy);

        component.props.onclick({a: 3});
        expect(clickSpy).toHaveBeenCalled();
        assert(clickSpy.calls.length === 1);
        expect(clickSpy.calls[0].arguments).toEqual([{
            type: 'click',
            currentTarget: {dataset: {}, id: undefined},
            target: {dataset: {}, id: undefined},
            detail: {a: 3}
        }]);
        expect(clickSpy.calls[0].context).toBe(component);

        component.props.onC({a: 3});
        expect(onCSpy).toHaveBeenCalled();
        assert(onCSpy.calls.length === 1);
        expect(onCSpy.calls[0].arguments).toEqual([{
            type: 'c',
            currentTarget: {dataset: {}, id: undefined},
            target: {dataset: {}, id: undefined},
            detail: {a: 3}
        }]);
        expect(onCSpy.calls[0].context).toBe(component);
    });

});
