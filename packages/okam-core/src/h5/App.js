/**
 * @file Create h5 app instance
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-export-on-declare */
/* global document:false */
/* global window:false */

import createApp from '../App';
import appBase from './base/application';
import Vue from 'vue';
import VueRouter from 'vue-router';
import browserHistory from './util/browserHistory';

const vueAppBase = createApp(appBase);

let tabBarComponent;

/**
 * Navigation Before Guards
 *
 * @inner
 * @param {Router} router the router instance
 */
function navBeforeGuards(router) {
    router.beforeEach((to, from, next) => {
        let toPath = decodeURI(to.fullPath);
        let fromPath = decodeURI(from.fullPath);
        const browserHistoryArr = browserHistory.list;
        const browserHistoryLength = browserHistory.length;
        let browserHistoryIndex = -1;
        for (let i = browserHistoryLength; i >= 0; i--) {
            if (browserHistoryArr[i] && browserHistoryArr[i].path === toPath) {
                browserHistoryIndex = i;
            }
        }

        for (let i = browserHistoryLength; i >= 0; i--) {
            if (browserHistoryArr[i] && browserHistoryArr[i].path === fromPath) {
                browserHistoryArr[i].pos = window.pageYOffset;
            }

        }

        if (browserHistoryLength > 1
            && browserHistoryIndex <= browserHistoryLength - 2 && browserHistoryIndex >= 0
        ) {
            browserHistoryArr.splice(
                browserHistoryIndex + 1,
                browserHistoryLength - browserHistoryIndex - 1
            );
        }
        else {
            // 进入无网络页后返回前一页面 会使得前一页面再次被push进browserHistoryArr, 需要避免这次重复push
            if (browserHistory.length === 0
                || -1 === browserHistoryIndex
                || browserHistoryIndex !== browserHistoryLength - 1) {
                browserHistoryArr.push({
                    path: toPath,
                    route: to.path.replace(/^\//, ''),
                    uri: to.path.replace(/^\//, ''),
                    options: to.query
                });
            }
        }
        Vue.prototype.currentRoute = browserHistoryArr;
        browserHistory.set(browserHistoryArr);
        next();
    });
}

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

    navBeforeGuards(router);

    router.afterEach((to, from, next) => {
        if (!tabBarEle) {
            tabBarEle = document.querySelector('.okam-tabbar-wrap');
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

function vueAppCreator(appConfig, ...args) {
    const {
        routes,
        tabBar,
        networkTimeout,
        window,
        appLayout
    } = appConfig;
    const router = new VueRouter({
        mode: 'hash',
        routes: routes
    });

    tabBar && initRouterHook(router, tabBar);

    args[0].appConfig = Object.assign({}, window, {
        networkTimeout
    });

    new Vue(Object.assign({
        el: '#app',
        router,

        mounted() {
            tabBarComponent = this.$refs.tabBar;
        },

        methods: {
            handleScroll(e) {
                this.$refs.currentRouter
                && this.$refs.currentRouter.onPageScroll
                && this.$refs.currentRouter.onPageScroll(e);
            },
            handleReachBottom(e) {
                this.$refs.currentRouter
                && this.$refs.currentRouter.onReachBottom
                && this.$refs.currentRouter.onReachBottom(e);
            }
        },

        render(createElement) {
            // todo: jsx?
            let routerViewEle = createElement('router-view', {
                ref: 'currentRouter'
            });

            let keepAlive = createElement('keep-alive', {
            }, [routerViewEle]);

            let pullUpRefreshCreator = [
                createElement(
                    appLayout.pullUpRefreshCreator, {
                        on: {
                            'page-scroll': this.handleScroll,
                            'reach-bottom': this.handleReachBottom
                        }
                    },
                    [keepAlive]
                )
            ];
            let children = [
                createElement('div', {
                    attrs: {
                        'class': 'okam-app-container'
                    }
                }, [pullUpRefreshCreator])
            ];

            if (tabBar) {
                let tabBarProps = tabBar.props;
                let isTopPosition = tabBarProps.position === 'top';

                children[isTopPosition ? 'unshift' : 'push'](
                    createElement(
                        appLayout.tabBarCreator,
                        {
                            props: tabBarProps,
                            ref: 'tabBar'
                        }
                    )
                );
            }

            return createElement('div', {
                attrs: {
                    'id': 'app',
                    'class': 'okam-app-wrap'
                },
                style: {
                    backgroundColor: window.backgroundColor || ''
                }
            }, children);
        }
    }, vueAppBase.apply(null, args)));
}

Object.assign(vueAppCreator, vueAppBase);

export default vueAppCreator;
