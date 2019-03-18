/**
 * @file Show modal API for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global document:false */

import {execAsyncApiCallback} from '../helper';
import {renderTpl} from './common/helper';

const FADE_IN_CLASS = 'weui-animate-fade-in';
const FADE_OUT_CLASS = 'weui-animate-fade-out';

const MASK_CLASS = 'weui-mask';
const MODAL_CLASS = 'weui-dialog';
const MODAL_TITLE_CLASS = 'weui-dialog__title';
const MODAL_BODY_CLASS = 'weui-dialog__bd';
const MODAL_FOOT_CLASS = 'weui-dialog__ft';
const MODAL_OK_BTN_CLASS = 'weui-dialog__btn_primary';
const MODAL_CANCEL_BTN_CLASS = 'weui-dialog__btn_default';

const MODAL_TPL = `
<div class="${MASK_CLASS}"></div>
<div class="${MODAL_CLASS}">
    <div class="weui-dialog__hd">
        <strong class="${MODAL_TITLE_CLASS}"></strong>
    </div>
    <div class="${MODAL_BODY_CLASS}"></div>
    <div class="${MODAL_FOOT_CLASS}"></div>
</div>
`;

const FOOT_CANCEL_TPL = '<div class="weui-dialog__btn ' + MODAL_CANCEL_BTN_CLASS
    + '" style="color: ${cancelColor}">${cancelText}</div>';
const FOOT_OK_TPL = '<div class="weui-dialog__btn ' + MODAL_OK_BTN_CLASS
    + '" style="color: ${confirmColor}">${confirmText}</div>';

let modalElem;
let currProcessOption;
let animationTimer;

function toggleModal(show, elem) {
    elem.style.opacity = show ? 1 : 0;
    if (show) {
        elem.className = FADE_IN_CLASS;
        elem.style.display = 'block';
    }
    else {
        elem.className = FADE_OUT_CLASS;
        animationTimer = setTimeout(
            () => (elem.style.display = 'none'), 200
        );
    }
}

function execCallback(isCancel) {
    execAsyncApiCallback(
        'showModal', currProcessOption, null,
        {cancel: isCancel, confirm: !isCancel}, true
    );
}

function cancelModal() {
    toggleModal(false, modalElem);
    execCallback(true);
}

function confirmModal() {
    toggleModal(false, modalElem);
    execCallback(false);
}

function createModal() {
    let el = document.createElement('div');
    el.style.opacity = 0;
    el.style.display = 'none';
    el.innerHTML = MODAL_TPL;
    document.body.appendChild(el);

    return el;
}

function bindFooterClick(footElem, showCancel) {
    let okBtn = footElem.querySelector(`.${MODAL_OK_BTN_CLASS}`);
    okBtn.onclick = confirmModal;

    if (showCancel) {
        let cancelBtn = footElem.querySelector(`.${MODAL_CANCEL_BTN_CLASS}`);
        cancelBtn.onclick = cancelModal;
    }
}

export default {

    /**
     * Show action sheet
     *
     * @param {Object} options the options to show
     * @param {string} options.title the modal title to show
     * @param {string} options.content the modal content to show
     * @param {boolean} options.showCancel whether show cancel button,
     *        optional, by default true
     * @param {string=} options.cancelText the cancel button text, by default '取消'
     * @param {string=} options.cancelColor the cancel button text color, by default '#000'
     * @param {string=} options.confirmText the confirm button text, by default '确定'
     * @param {string=} options.confirmColor the confirm button text color, by default '#576B95'
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     */
    showModal(options) {
        currProcessOption = options;
        if (!modalElem) {
            modalElem = createModal();
        }

        // init title
        const {title, content, showCancel = true} = options;
        let titleElem = modalElem.querySelector(`.${MODAL_TITLE_CLASS}`);
        titleElem.textContent = title;

        // init body
        let bodyElem = modalElem.querySelector(`.${MODAL_BODY_CLASS}`);
        bodyElem.textContent = content;

        // init footer
        let footElem = modalElem.querySelector(`.${MODAL_FOOT_CLASS}`);
        let footTpl = '';
        if (showCancel) {
            let {cancelText = '取消', cancelColor = '#000'} = options;
            footTpl += renderTpl(FOOT_CANCEL_TPL, {cancelText, cancelColor}, true);
        }

        let {confirmText = '确定', confirmColor = '#576B95'} = options;
        footTpl += renderTpl(FOOT_OK_TPL, {confirmText, confirmColor}, true);
        footElem.innerHTML = footTpl;
        bindFooterClick(footElem, showCancel);

        // show modal
        animationTimer && clearTimeout(animationTimer);
        animationTimer = null;
        toggleModal(true, modalElem);
    }
};
