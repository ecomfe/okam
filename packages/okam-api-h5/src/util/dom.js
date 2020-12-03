/**
 * @file The dom utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global document:false */
/* global window:false */

const isCSS1Compat = (document.compatMode === 'CSS1Compat');
const docElem = document.documentElement;
const docBody = document.body;

function getCompatScroll() {
    let elem = isCSS1Compat ? docElem : docBody;
    return {
        scrollTop: elem.scrollTop,
        scrollLeft: elem.scrollLeft
    };
}

function getPageOffset() {
    return {
        scrollTop: window.pageYOffset,
        scrollLeft: window.pageXOffset
    };
}

/**
 * Get the window scroll offset info
 *
 * @return {Object}
 */
export const getWindowScroll = window.pageYOffset !== undefined
    ? getPageOffset : getCompatScroll;

