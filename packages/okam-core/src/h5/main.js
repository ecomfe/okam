/**
 * @file The h5 app env
 * @author sparklewhy@gmail.com
 */

'use strict';

import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import App from './App.vue';
import routes from './routes';
import extendVue from './common/biz/vue';

/* eslint-disable no-undef */

Vue.use(ElementUI);
Vue.use(VueRouter);

extendVue(Vue);

const router = new VueRouter({
    mode: 'hash',
    routes: routes
});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});

