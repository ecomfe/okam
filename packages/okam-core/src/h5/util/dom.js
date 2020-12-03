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


/**
 * Add class
 *
 * @param {HTMLElement} element the target element
 * @param {string} className the class name to add
 */
export function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    }
    else {
        let classes = element.className.split(/\s+/);
        if (classes.indexOf(className) === -1) {
            classes.push(className);
        }
        element.className = classes.join(' ');
    }
}

/**
 * Remove class
 *
 * @param {HTMLElement} element the target element
 * @param {string} className the class name to remove
 */
export function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    }
    else {
        let classes = element.className.split(/\s+/);
        let foundIdx = classes.indexOf(className);
        if (foundIdx !== -1) {
            classes.splice(foundIdx, 1);
        }
        element.className = classes.join(' ');
    }
}
