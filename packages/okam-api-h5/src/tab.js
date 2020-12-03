/**
 * @file Tab bar API for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

import {execAsyncApiCallback} from './helper';

let tabBarComponent;

function toggleTabBarRedDot(options, apiName, show) {
    if (!tabBarComponent) {
        return;
    }

    let result = tabBarComponent.toggleRedDot(options.index, show);
    execAsyncApiCallback(apiName, options, result ? null : '');
}

function toggleTabBar(options, apiName, show) {
    if (!tabBarComponent) {
        return;
    }

    tabBarComponent.toggleTabBar(show, options.animation, () => {
        execAsyncApiCallback(apiName, options);
    });
}


function toggleTabBarBadge(options, apiName, show) {
    if (!tabBarComponent) {
        return;
    }

    let {index, text} = options;
    let result = tabBarComponent.setTabBarBadge(index, show ? text : '');
    execAsyncApiCallback(apiName, options, result ? null : '');
}

/* eslint-disable fecs-camelcase */
export default {

    /**
     * Init tab bar component instance
     *
     * @param {Component} tabBar the tab bar component instance
     */
    _initTabBarInstance(tabBar) {
        tabBarComponent = tabBar;
    },

    /**
     * Show tab bar item red dot
     *
     * @param {Object} options the options to show
     * @param {number} options.index the tab item index to show
     * @param {Function=} options.success the successful callback
     * @param {Function=} options.complete the done callback
     * @param {Function=} options.fail the fail callback
     */
    showTabBarRedDot(options) {
        toggleTabBarRedDot(options, 'showTabBarRedDot', true);
    },

    /**
     * Hide tab bar item red dot
     *
     * @param {Object} options the options to hide
     * @param {number} options.index the tab item index to hide
     * @param {Function=} options.success the successful callback
     * @param {Function=} options.complete the done callback
     * @param {Function=} options.fail the fail callback
     */
    hideTabBarRedDot(options) {
        toggleTabBarRedDot(options, 'hideTabBarRedDot', false);
    },

    /**
     * Show tab bar
     *
     * @param {Object} options the options to show
     * @param {boolean=} options.animation whether to enable animation
     * @param {Function=} options.success the successful callback
     * @param {Function=} options.complete the done callback
     * @param {Function=} options.fail the fail callback
     */
    showTabBar(options) {
        toggleTabBar(options, 'showTabBar', true);
    },

    /**
     * Hide tab bar
     *
     * @param {Object} options the options to hide
     * @param {boolean=} options.animation whether to enable animation
     * @param {Function=} options.success the successful callback
     * @param {Function=} options.complete the done callback
     * @param {Function=} options.fail the fail callback
     */
    hideTabBar(options) {
        toggleTabBar(options, 'hideTabBar', false);
    },

    /**
     * Set tab bar style
     *
     * @param {Object} options the options to hide
     * @param {string=} options.color the tab text color
     * @param {string=} options.selectedColor the tab text selected color
     * @param {string=} options.backgroundColor the tab bar background color
     * @param {string=} options.borderStyle the tab bar border style,
     *        validated value: white / black
     * @param {Function=} options.success the successful callback
     * @param {Function=} options.complete the done callback
     * @param {Function=} options.fail the fail callback
     */
    setTabBarStyle(options) {
        if (!tabBarComponent) {
            return;
        }

        tabBarComponent.setTabBarStyle(options);
        execAsyncApiCallback('setTabBarStyle', options);
    },

    /**
     * Set tab bar item info
     *
     * @param {Object} options the options to set
     * @param {number} options.index the tab item index to set
     * @param {string=} options.text the tab item text info to set
     * @param {string=} options.iconPath the tab item icon to show
     * @param {string=} options.selectedIconPath the tab item activated icon to show
     * @param {Function=} options.success the successful callback
     * @param {Function=} options.complete the done callback
     * @param {Function=} options.fail the fail callback
     */
    setTabBarItem(options) {
        if (!tabBarComponent) {
            return;
        }

        let {index} = options;
        let tabInfoAttrs = ['text', 'iconPath', 'selectedIconPath'];
        let info = {};
        tabInfoAttrs.forEach(k => {
            if (options.hasOwnProperty(k)) {
                info[k] = options[k];
            }
        });
        let result = tabBarComponent.setTabBarItem(index, info);
        execAsyncApiCallback('setTabBarItem', options, result ? null : '');
    },

    /**
     * Set tab bar item badge
     *
     * @param {Object} options the options to set
     * @param {number} options.index the tab item index to set
     * @param {string=} options.text the tab item badge text info to set
     * @param {Function=} options.success the successful callback
     * @param {Function=} options.complete the done callback
     * @param {Function=} options.fail the fail callback
     */
    setTabBarBadge(options) {
        toggleTabBarBadge(options, 'setTabBarBadge', true);
    },

    /**
     * Remove tab bar item badge
     *
     * @param {Object} options the options to remove
     * @param {number} options.index the tab item index to remove badge
     * @param {Function=} options.success the successful callback
     * @param {Function=} options.complete the done callback
     * @param {Function=} options.fail the fail callback
     */
    removeTabBarBadge(options) {
        toggleTabBarBadge(options, 'removeTabBarBadge', false);
    }
};
