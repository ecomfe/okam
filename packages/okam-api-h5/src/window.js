/**
 * @file Window API for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global window:false */

function getWindowSizeInfo() {
    return {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
    };
}

export default {

    /**
     * Listener window resize event
     *
     * @param {Function} callback the callback to execute when resize happens
     */
    onWindowResize(callback) {
        let onResize = function () {
            callback(getWindowSizeInfo());
        };

        callback.__listener = onResize;
        window.addEventListener('resize', onResize);
    },

    /**
     * Remove window resize listener
     *
     * @param {Function} callback the callback to remove
     */
    offWindowResize(callback) {
        let listener = callback && callback.__listener;
        listener && window.removeEventListener('resize', listener);
    }
};
