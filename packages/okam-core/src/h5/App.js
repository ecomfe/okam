/**
 * @file Create h5 app instance
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-export-on-declare */
/* global document:false */

import createApp from '../App';
import appBase from './base/application';
import Vue from 'vue';
import VueRouter from 'vue-router';

const vueAppBase = createApp(appBase);

let tabBarComponent;

/**
 * Init router hook
 *
 * @inner
 * @param {Router} router the router instance
 * @param {Object} tabBar the tabBar config
 */
function initRouterHook(router, tabBar) {
    const tabPagePaths = tabBar.props.list.map(item => {
        let {pagePath} = item;
        pagePath = pagePath.replace(/^\.+/, '');
        if (pagePath.charAt(0) !== '/') {
            pagePath = `/${pagePath}`;
        }

        // reset page path
        item.pagePath = pagePath;
        return pagePath;
    });

    let tabBarEle;
    router.afterEach((to, from, next) => {
        if (!tabBarEle) {
            tabBarEle = document.querySelector('.okam-tabbar-container');
        }

        if (!tabBarEle) {
            return;
        }

        let toPath = to.path;
        let selTabIdx = tabPagePaths.indexOf(toPath);
        let show = selTabIdx !== -1;
        if (show) {
            tabBarComponent && tabBarComponent.setActiveIndex(selTabIdx);
        }
        tabBarEle.style.display = show ? 'block' : 'none';
        tabBarComponent && (tabBarComponent.show = show);
    });
}

function vueAppCreator({routes, tabBar}, ...args) {
    const router = new VueRouter({
        mode: 'hash',
        routes: routes
    });

    tabBar && initRouterHook(router, tabBar);

    new Vue(Object.assign({
        el: '#app',
        router,

        mounted() {
            tabBarComponent = this.$refs.tabBar;
        },

        render(createElement) {
            let children;
            if (tabBar) {
                let tabBarProps = tabBar.props;
                let isTopPosition = tabBarProps.position === 'top';

                let routerViewEle = createElement('router-view');
                children = [
                    createElement('div', {
                        attrs: {
                            class: 'okam-tabbar-content'
                        }
                    }, [routerViewEle])
                ];

                children[isTopPosition ? 'unshift' : 'push'](
                    createElement(
                        tabBar.creator,
                        {
                            props: tabBarProps,
                            ref: 'tabBar'
                        }
                    )
                );
            }
            else {
                children = [createElement('router-view')];
            }

            return createElement('div', {
                attrs: {
                    id: 'app',
                    class: 'okam-tabbar-wrap'
                }
            }, children);
        }
    }, vueAppBase.apply(null, args)));
}

Object.assign(vueAppCreator, vueAppBase);

export default vueAppCreator;
