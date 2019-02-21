/**
 * @file Toast UI API for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global document:false */
/* eslint-disable fecs-export-on-declare */

import './toast.styl';
import {processAsyncApiCallback} from '../helper';

let toastElem;
let hideTimer;

const TOAST_ICON_CLASS = 'okam-api-toast-icon';
const TOAST_IMG_CLASS = 'okam-api-toast-image';
const TOAST_SUCCESS_ICON_CLASS = 'okam-icon-success_no_circle';
const TOAST_LOADING_ICON_CLASS = 'okam-api-loading';
const TOAST_MAST_CLASS = 'okam-api-toast-mask';
const TOAST_TEMPLATE = `
    <div class="${TOAST_MAST_CLASS}"></div>
    <div class="okam-api-toast-content">
        <div class="${TOAST_ICON_CLASS}"></div>
        <div class="okam-api-toast-title"></div>
    </div>
`;

/**
 * Init toast elem
 *
 * @inner
 * @return {HTMLElement}
 */
function initToastElem() {
    if (!toastElem) {
        toastElem = document.createElement('div');
        toastElem.className = 'okam-api-toast';
        toastElem.innerHTML = TOAST_TEMPLATE.trim();
        document.body.appendChild(toastElem);
    }
    return toastElem;
}

function showToastSync(options) {
    const toastElem = initToastElem();
    let {
        title,
        icon = 'success',
        image,
        duration,
        mask
    } = options || {};

    // up toast title
    toastElem.querySelector('.okam-api-toast-title').innerText = title || '';
    let iconElem = toastElem.querySelector(`.${TOAST_ICON_CLASS}`);

    // up toast icon/image
    if (image) {
        iconElem.className = [TOAST_ICON_CLASS, TOAST_IMG_CLASS].join(' ');
        iconElem.style.backgroundImage = `url(${image})`;
    }
    else {
        let iconClass = icon === 'loading'
            ? TOAST_LOADING_ICON_CLASS : TOAST_SUCCESS_ICON_CLASS;
        iconElem.className = [TOAST_ICON_CLASS, iconClass].join(' ');
        iconElem.style.removeProperty('backgroundImage');
    }

    // up toast mask
    let maskElem = toastElem.querySelector(`.${TOAST_MAST_CLASS}`);
    maskElem.style.display = mask ? 'block' : 'none';

    // show toast
    duration = (duration && parseInt(duration, 10)) || 1500;
    toastElem.style.opacity = 1;
    toastElem.style.display = 'block';

    hideTimer && clearTimeout(hideTimer);
    hideTimer = null;
    setTimeout(hideToast, duration);
}

/**
 * Show toast
 *
 * @param {Object} options the options to show
 * @param {string} options.title the toast title
 * @param {string=} options.icon the toast icon, by default `success`,
 *        validated value: `loading` `success`
 * @param {string=} options.image the toast image url, the value has higher
 *        priority than `icon` option, optional
 * @param {number=} options.duration the toast show duration, by default 1500,
 *        the unit is milliseconds
 * @param {boolean=} options.mask whether show mask to disable user interaction,
 *        by default false, optional
 * @param {Function=} options.success the success callback
 * @param {Function=} options.fail the fail callback
 * @param {Function=} options.complete the done callback whatever is
 *        success or fail.
 */
function showToast(options) {
    processAsyncApiCallback('showToast', showToastSync, [options], options);
}

function hideToastSync() {
    if (!toastElem) {
        return;
    }

    toastElem.style.opacity = 0;
    hideTimer && clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
        toastElem.style.display = 'none';
    }, 100);
}

/**
 * Hide toast
 *
 * @param {Object=} options the options
 * @param {Function=} options.success the success callback
 * @param {Function=} options.fail the fail callback
 * @param {Function=} options.complete the done callback whatever is
 *        success or fail.
 */
function hideToast(options) {
    processAsyncApiCallback('hideToast', hideToastSync, [], options);
}

export default {
    showToast,
    hideToast
};
