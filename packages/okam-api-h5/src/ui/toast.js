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
let animationTimer;

const FADE_IN_CLASS = 'weui-animate-fade-in';
const FADE_OUT_CLASS = 'weui-animate-fade-out';

const TOAST_CLASS = 'okam-api-toast';
const TOAST_ICON_CLASS = 'okam-api-toast-icon';
const TOAST_IMG_CLASS = 'okam-api-toast-image';
const TOAST_SUCCESS_ICON_CLASS = 'weui-icon-success-no-circle';
const TOAST_LOADING_ICON_CLASS = 'weui-loading';
const TOAST_MAST_CLASS = 'weui-mask_transparent';

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
        toastElem.className = TOAST_CLASS;
        toastElem.innerHTML = TOAST_TEMPLATE.trim();
        document.body.appendChild(toastElem);
    }
    return toastElem;
}

function showToastSync(options) {
    const toastElem = initToastElem();
    /* eslint-disable fecs-camelcase */
    let {
        title,
        icon = 'success',
        image,
        duration,
        mask,
        _loading
    } = options || {};

    // up toast title
    toastElem.querySelector('.okam-api-toast-title').textContent = title || '';
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
        iconElem.style.removeProperty('background-image');
    }

    // up toast mask
    let maskElem = toastElem.querySelector(`.${TOAST_MAST_CLASS}`);
    maskElem.style.display = mask ? 'block' : 'none';

    // show toast

    toastElem.className = `${FADE_IN_CLASS} ${TOAST_CLASS}`;
    toastElem.style.opacity = 1;
    toastElem.style.display = 'block';

    animationTimer && clearTimeout(animationTimer);
    animationTimer = null;

    hideTimer && clearTimeout(hideTimer);
    hideTimer = null;
    if (!_loading) {
        duration = (duration && parseInt(duration, 10)) || 1500;
        hideTimer = setTimeout(hideToast, duration);
    }
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

    toastElem.className = `${FADE_OUT_CLASS} ${TOAST_CLASS}`;
    toastElem.style.opacity = 0;
    animationTimer = setTimeout(() => (toastElem.style.display = 'none'), 200);
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
    hideToast,

    /**
     * Show loading
     *
     * @param {Object} options the options to show
     * @param {string} options.title the toast title
     * @param {boolean=} options.mask whether show mask to disable user interaction,
     *        by default false, optional
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     */
    showLoading(options) {
        let opts = Object.assign({}, options, {
            icon: 'loading',
            image: null,
            /* eslint-disable fecs-camelcase */
            _loading: true
        });
        processAsyncApiCallback('showLoading', showToastSync, [opts], opts);
    },

    /**
     * Hide loading
     *
     * @param {Object=} options the options
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     */
    hideLoading(options) {
        processAsyncApiCallback('hideLoading', hideToastSync, [], options);
    }
};
