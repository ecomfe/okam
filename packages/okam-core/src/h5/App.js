/**
 * @file Create h5 app instance
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-export-on-declare */

import createApp from '../App';
import appBase from './base/application';
import Vue from 'vue';
import VueRouter from 'vue-router';

const vueAppBase = createApp(appBase);

function vueAppCreator(routes, ...args) {
    new Vue(Object.assign({
        el: '#app',
        router: new VueRouter({
            mode: 'hash',
            routes: routes
        }),
        render(createElement) {
            let children = [createElement('router-view')];
            return createElement('div', {
                attrs: {
                    id: 'app'
                }
            }, children);
        }
    }, vueAppBase.apply(null, args)));
}

Object.assign(vueAppCreator, vueAppBase);

export default vueAppCreator;
