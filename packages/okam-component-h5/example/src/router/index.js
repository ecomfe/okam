/**
 * @file App router config
 * @author xxx
 */

import Vue from 'vue';
import Router from 'vue-router';

import Button from 'pages/button';
import TabBar from 'pages/tabbar';

Vue.use(Router);

const routes = [
    {
        path: '/button',
        component: Button
    },
    {
        path: '/tabbar',
        component: TabBar
    }
];

export default new Router({
    routes
});
