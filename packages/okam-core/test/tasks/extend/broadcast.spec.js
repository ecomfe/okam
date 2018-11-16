/**
 * @file Broadcast support test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */

import assert from 'assert';
import expect, {createSpy} from 'expect';
import MyApp from 'core/App';
import MyPage from 'core/Page';
import {clearBaseCache} from 'core/helper/factory';
import broadcast from 'core/extend/broadcast';
import eventCenter from 'core/helper/eventCenter';
import {fakeComponent, fakeAppEnvAPIs} from 'test/helper';

describe('broadcast', function () {
    let MyComponent;
    let restoreAppEnv;

    beforeEach('init global App', function () {
        clearBaseCache();

        MyComponent = fakeComponent();
        restoreAppEnv = fakeAppEnvAPIs('swan');
    });

    afterEach('clear global App', function () {
        MyComponent = undefined;
        restoreAppEnv();
        expect.restoreSpies();
        eventCenter.off();
    });

    it('should normalize the broadcast events declaration in page', function () {
        MyApp.use(broadcast);
        let broadcastEvents = {
            eventA() {}
        };
        let page = MyPage({
            broadcastEvents
        });

        assert(typeof page.$rawBroadcastEvents === 'object');
        assert(page.broadcastEvents === undefined);
        expect(page.$rawBroadcastEvents).toEqual(broadcastEvents);
    });

    it('should normalize the broadcast events declaration in component', function () {
        MyApp.use(broadcast);
        let broadcastEvents = {
            eventA() {}
        };
        let component = MyComponent({
            broadcastEvents
        });

        assert(typeof component.methods.$rawBroadcastEvents === 'function');
        assert(component.broadcastEvents === undefined);
        expect(component.$rawBroadcastEvents()).toEqual(broadcastEvents);
    });

    it('should bind the declaration broadcast events in component', function () {
        MyApp.use(broadcast);
        let broadcastEvents = {
            eventA() {},
            eventB() {},
            /* eslint-disable fecs-use-method-definition */
            'eventC.once': () => {}
        };
        let component = MyComponent({
            broadcastEvents,

            beforeCreate() {
                let listeners = Object.keys(eventCenter._listeners);
                assert(listeners.length === 0);
            },
            created() {
                let listeners = eventCenter._listeners;
                expect(Object.keys(listeners)).toEqual(['eventA', 'eventB', 'eventC']);
                assert(listeners.eventA.length === 1);
                assert(listeners.eventA[0]._once === false);
                assert(listeners.eventB.length === 1);
                assert(listeners.eventB[0]._once === false);
                assert(listeners.eventC.length === 1);
                assert(listeners.eventC[0]._once === true);
            }
        });

        component.created();
        component.attached();
        component.ready();

        assert(typeof component.$broadcast === 'function');
        assert(typeof component.$onBroadcast === 'function');
        assert(typeof component.$offBroadcast === 'function');

        component.detached();

        let listeners = eventCenter._listeners;
        let listenerEventNames = Object.keys(listeners);
        expect(listenerEventNames).toEqual(['eventA', 'eventB', 'eventC']);
        listenerEventNames.forEach(name => {
            assert(listeners[name].length === 0);
        });
    });

    it('should bind the declaration broadcast events in page', function () {
        MyApp.use(broadcast);
        let broadcastEvents = {
            eventA() {},
            eventB() {},
            /* eslint-disable fecs-use-method-definition */
            'eventC.once': function () {}
        };
        let page = MyPage({
            broadcastEvents,

            beforeCreate() {
                let listeners = Object.keys(eventCenter._listeners);
                assert(listeners.length === 0);
            },
            created() {
                let listeners = eventCenter._listeners;
                expect(Object.keys(listeners)).toEqual(['eventA', 'eventB', 'eventC']);
                assert(listeners.eventA.length === 1);
                assert(listeners.eventA[0]._once === false);
                assert(listeners.eventB.length === 1);
                assert(listeners.eventB[0]._once === false);
                assert(listeners.eventC.length === 1);
                assert(listeners.eventC[0]._once === true);
            }
        });

        page.onLoad();
        page.onReady();

        assert(typeof page.$broadcast === 'function');
        assert(typeof page.$onBroadcast === 'function');
        assert(typeof page.$offBroadcast === 'function');

        page.onUnload();

        let listeners = eventCenter._listeners;
        let listenerEventNames = Object.keys(listeners);
        expect(listenerEventNames).toEqual(['eventA', 'eventB', 'eventC']);
        listenerEventNames.forEach(name => {
            assert(listeners[name].length === 0);
        });
    });

    it('should bind the declaration broadcast events in app', function () {
        MyApp.use(broadcast);
        let broadcastEvents = {
            eventA() {},
            eventB() {},
            /* eslint-disable fecs-use-method-definition */
            'eventC.once': function () {}
        };
        let app = MyApp({
            broadcastEvents,

            onLaunch() {
                let listeners = Object.keys(eventCenter._listeners);
                assert(listeners.length === 3);
                expect(listeners).toEqual(['eventA', 'eventB', 'eventC']);
            }
        });

        app.onLaunch();
        app.onShow();

        assert(typeof app.$broadcast === 'function');
        assert(typeof app.$onBroadcast === 'function');
        assert(typeof app.$offBroadcast === 'function');
    });

    it('should support broadcast in component', function () {
        MyApp.use(broadcast);
        let spyEventC = createSpy(() => {});
        let broadcastEvents = {
            eventA() {},
            eventB() {},
            /* eslint-disable fecs-use-method-definition */
            'eventC.once': spyEventC
        };
        let component = MyComponent({
            broadcastEvents
        });

        component.created();
        component.attached();
        component.ready();

        const listeners = eventCenter._listeners;

        // test onBroadCast
        assert(typeof component.$onBroadcast === 'function');
        let spyListener = createSpy(() => {});
        component.$onBroadcast('eventD', spyListener);
        eventCenter.emit('eventD', 'hello');
        expect(spyListener).toHaveBeenCalledWith('hello');
        assert(spyListener.calls.length === 1);
        assert(spyListener.calls[0].context === eventCenter);

        // test broadcast
        assert(typeof component.$broadcast === 'function');
        component.$broadcast('eventD', 'hello2');
        expect(spyListener).toHaveBeenCalledWith('hello2');
        assert(spyListener.calls.length === 2);
        assert(spyListener.calls[1].context === eventCenter);

        // test off broadcast
        assert(typeof component.$offBroadcast === 'function');
        component.$offBroadcast('eventD', spyListener);
        component.$broadcast('eventD', 'hello3');
        assert(spyListener.calls.length === 2);

        // test declaration events handler
        component.$broadcast('eventC', 'hi');
        expect(spyEventC).toHaveBeenCalledWith('hi');
        assert(spyEventC.calls.length === 1);
        assert(spyEventC.calls[0].context === component);

        component.$broadcast('eventC', 'hi');
        assert(spyEventC.calls.length === 1);

        // test once broadcast
        let spyListener2 = createSpy(() => {});
        component.$onBroadcast('eventE', spyListener2, true);
        eventCenter.emit('eventE', 'e');
        expect(spyListener2).toHaveBeenCalledWith('e');
        assert(spyListener2.calls.length === 1);
        assert(spyListener2.calls[0].context === eventCenter);

        eventCenter.emit('eventE', 'e2');
        assert(spyListener2.calls.length === 1);
        assert(listeners.eventE.length === 0);

        component.detached();

        let listenerEventNames = Object.keys(listeners);
        expect(listenerEventNames).toEqual([
            'eventA', 'eventB', 'eventC', 'eventD', 'eventE'
        ]);
        listenerEventNames.forEach(name => {
            assert(listeners[name].length === 0);
        });
    });

    it('should support broadcast in app', function () {
        MyApp.use(broadcast);
        let spyEventC = createSpy(() => {});
        let broadcastEvents = {
            eventA() {},
            eventB() {},
            /* eslint-disable fecs-use-method-definition */
            'eventC.once': spyEventC
        };
        let app = MyApp({
            broadcastEvents
        });

        app.onLaunch();
        app.onShow();

        // test declaration events handler
        app.$broadcast('eventC', 'hi');
        expect(spyEventC).toHaveBeenCalledWith('hi');
        assert(spyEventC.calls.length === 1);
        assert(spyEventC.calls[0].context === app);

        app.$broadcast('eventC', 'hi');
        assert(spyEventC.calls.length === 1);
    });

    it('should allow none broadcast events declaration', function () {
        MyApp.use(broadcast);

        let app = MyApp({});
        app.onLaunch();
        app.onShow();

        let spyListener = createSpy(() => {});
        app.$onBroadcast('event', spyListener);

        let page = MyPage({});
        page.onLoad();
        page.onReady();

        let spyListener2 = createSpy(() => {});
        app.$onBroadcast('event', spyListener2);

        eventCenter.emit('event', 'a');
        expect(spyListener).toHaveBeenCalledWith('a');
        assert(spyListener.calls.length === 1);
        assert(spyListener.calls[0].context === eventCenter);

        expect(spyListener2).toHaveBeenCalledWith('a');
        assert(spyListener2.calls.length === 1);
        assert(spyListener2.calls[0].context === eventCenter);
    });

});
