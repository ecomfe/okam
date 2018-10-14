/**
 * @file Make component support broadcast ability
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-export-on-declare */

import eventCenter from '../helper/eventCenter';

const broadcastAPIs = {
    $broadcast(...args) {
        eventCenter.emit.apply(eventCenter, args);
    },

    $onbroadcast(eventName, handler, isOnce) {
        let bindEvents = this._bindBroadcastEvents;
        if (!bindEvents) {
            bindEvents = this._bindBroadcastEvents = [];
        }

        bindEvents.push([eventName, handler]);

        if (isOnce) {
            eventCenter.once(eventName, handler);
        }
        else {
            eventCenter.on(eventName, handler);
        }
    },

    $offbroadcast(eventName, handler) {
        eventCenter.off(eventName, handler);
    },

    bindBroadcastEvents() {
        let events = this.events;
        if (!events) {
            return;
        }

        let onceRegexp = /^(.*)\.once$/;
        let bindEvents = this._bindBroadcastEvents;
        if (!bindEvents) {
            bindEvents = this._bindBroadcastEvents = [];
        }

        Object.keys(events).forEach(k => {
            let result = onceRegexp.exec(k);
            let eventName = result ? result[1] : k;
            let handler = events[k].bind(this);
            bindEvents.push([eventName, handler]);

            if (result) {
                eventCenter.once(eventName, handler);
            }
            else {
                eventCenter.on(eventName, handler);
            }
        });
        this._bindBroadcastEvents = bindEvents;
    },

    removeBroadcastEventListeners() {
        let bindEvents = this._bindBroadcastEvents;
        if (!bindEvents) {
            return;
        }

        bindEvents.forEach(item => eventCenter.off(item[0], item[1]));
        this._bindBroadcastEvents = [];
    }
};

export default {
    app: Object.assign({
        ready() {
            this.bindBroadcastEvents();
        }
    }, broadcastAPIs),

    component: {
        ready() {
            this.bindBroadcastEvents();
        },

        detached() {
            this.removeBroadcastEventListeners();
        },

        methods: broadcastAPIs
    }
};
