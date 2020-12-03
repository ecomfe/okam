/**
 * @file App router config
 * @author xxx
 */

import Vue from 'vue';
import Router from 'vue-router';

import Button from 'pages/button';
import TabBar from 'pages/tabbar';
import Tabs from 'pages/tabs';
import Swiper from 'pages/Swiper';
import Checkbox from 'pages/Checkbox';

Vue.use(Router);

const routes = [
    {
        path: '/button',
        component: Button
    },
    {
        path: '/tabbar',
        component: TabBar
    },
    {
        path: '/swiper',
        component: Swiper
    },
    {
        path: '/checkbox',
        component: Checkbox
    },
    {
        path: '/tabs',
        component: Tabs
    }
];

export default new Router({
    routes
});
