/**
 * @file App router config
 * @author xxx
 */

import Vue from 'vue';
import Router from 'vue-router';

import Button from 'pages/button';

Vue.use(Router);

const routes = [
    {
        path: '/button',
        component: Button
    }
];

export default new Router({
    routes
});
