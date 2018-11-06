/**
 * @file Broadcast support test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */

import assert from 'assert';
import expect from 'expect';
import MyApp from 'core/App';
import * as na from 'core/na/index';
import base from 'core/base/base';
import MyPage from 'core/Page';
import {clearBaseCache} from 'core/helper/factory';
import broadcast from 'core/extend/broadcast';
import eventCenter from 'core/helper/eventCenter';
import {fakeComponent} from 'test/helper';

describe('broadcast', function () {
    const rawEnv = na.env;
    const rawGetCurrApp = na.getCurrApp;
    let MyComponent;
    beforeEach('init global App', function () {
        clearBaseCache();

        MyComponent = fakeComponent();

        global.swan = {
            createSelectorQuery() {
                return {
                    select(path) {
                        return path;
                    }
                };
            }
        };

        na.getCurrApp = function () {
            return {};
        };
        na.env = base.$api = global.swan;
    });

    afterEach('clear global App', function () {
        global.swan = undefined;
        MyComponent = undefined;
        na.getCurrApp = rawGetCurrApp;
        na.env = base.$api = rawEnv;
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

        assert(typeof component.$rawBroadcastEvents === 'function');
        assert(component.broadcastEvents === undefined);
        expect(component.$rawBroadcastEvents()).toEqual(broadcastEvents);
    });

    it('should bind the declaration broadcast events in component', function () {
        MyApp.use(broadcast);
        let broadcastEvents = {
            eventA() {},
            eventB() {},
            /* eslint-disable fecs-use-method-definition */
            'eventC.once': function () {}
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
        component.detached();

        let listeners = eventCenter._listeners;
        let listenerEventNames = Object.keys(listeners);
        expect(listenerEventNames).toEqual(['eventA', 'eventB', 'eventC']);
        listenerEventNames.forEach(name => {
            assert(listeners[name].length === 0);
        });
    });

});
