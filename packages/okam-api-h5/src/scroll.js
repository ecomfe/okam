/**
 * @file Scroll API for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global window:false */
/* global document:false */
/* global performance:false */
/* global requestAnimationFrame:false */

function getTime() {
    if (window.performance && 'now' in window.performance) {
        return performance.now();
    }
    return new Date().getTime();
}

function doScroll(scrollTop, duration, callback) {
    const initOffsetY = window.pageYOffset;
    const startTime = getTime();

    const docHeight = document.documentElement.scrollHeight;
    const windowHeight = document.documentElement.clientHeight;
    const maxScrollTop = docHeight - windowHeight;
    scrollTop > maxScrollTop && (scrollTop = maxScrollTop);
    const totalScrollOffset = scrollTop - initOffsetY;

    if (!window.requestAnimationFrame) {
        window.scroll(0, scrollTop);
        return callback && callback();
    }

    function scroll() {
        const percent = Math.min(1, (getTime() - startTime) / duration);
        window.scroll(0, Math.ceil(percent * totalScrollOffset + initOffsetY));

        if (window.pageYOffset === scrollTop) {
            return callback && callback();
        }

        requestAnimationFrame(scroll);
    }

    scroll();
}

export default {
    pageScrollTo(options) {
        let {
            duration = 300,
            scrollTop,
            complete,
            success
        } = options;

        doScroll(scrollTop, duration, () => {
            let res = {errMsg: 'pageScrollTo:ok'};
            success && complete(res);
            complete && complete(res);
        });
    }
};
