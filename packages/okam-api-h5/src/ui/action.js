/**
 * @file Show action sheet API for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global document:false */

import {execAsyncApiCallback} from '../helper';

const FADE_IN_CLASS = 'okam-api-fade-in';
const FADE_OUT_CLASS = 'okam-api-fade-out';

const ACTION_SHEET_CLASS = 'weui-actionsheet';
const ACTION_TOGGLE_CLASS = 'weui-actionsheet_toggle';
const ACTION_MASK_CLASS = 'weui-mask';
const ACTION_MENU_CLASS = 'weui-actionsheet__menu';
const ACTION_MENU_ITEM_CLASS = 'weui-actionsheet__cell';
const ACTION_CANCEL_CLASS = 'weui-actionsheet__action';

const ACTION_SHEET_TPL = `
<div class="${ACTION_MASK_CLASS}"></div>
<div class="${ACTION_SHEET_CLASS}">
    <div class="${ACTION_MENU_CLASS}"></div>
    <div class="${ACTION_CANCEL_CLASS}">
        <div class="${ACTION_MENU_ITEM_CLASS}">取消</div>
    </div>
</div>
`;

let actionSheetElem;
let currProcessOption;
let animationTimer;

function toggleMask(show) {
    let maskElem = actionSheetElem.querySelector(`.${ACTION_MASK_CLASS}`);
    maskElem.style.opacity = show ? 1 : 0;
    if (show) {
        maskElem.className = `${FADE_IN_CLASS} ${ACTION_MASK_CLASS}`;
        maskElem.style.display = 'block';
    }
    else {
        maskElem.className = `${FADE_OUT_CLASS} ${ACTION_MASK_CLASS}`;
        animationTimer = setTimeout(
            () => (maskElem.style.display = 'none'), 200
        );
    }
}

function hideActionSheet() {
    let menuWrapElem = actionSheetElem.querySelector(`.${ACTION_SHEET_CLASS}`);
    menuWrapElem.className = ACTION_SHEET_CLASS;
    toggleMask(false);
}

function cancelActionSheet() {
    execAsyncApiCallback('showActionSheet', currProcessOption, 'cancel');
    hideActionSheet();
}

function handleItemClick(e) {
    let tapIndex =  +e.currentTarget.dataset.tapIndex;
    execAsyncApiCallback(
        'showActionSheet', currProcessOption, null, {tapIndex}, true
    );
    hideActionSheet();
}

function createActionSheet() {
    let el = document.createElement('div');
    el.innerHTML = ACTION_SHEET_TPL;
    document.body.appendChild(el);

    let maskElem = el.querySelector(`.${ACTION_MASK_CLASS}`);
    maskElem.onclick = cancelActionSheet;

    let cancelElem = el.querySelector(`.${ACTION_CANCEL_CLASS}`);
    cancelElem.onclick = cancelActionSheet;

    return el;
}

export default {

    /**
     * Show action sheet
     *
     * @param {Object} options the options to show
     * @param {Array.<string>} options.itemList the item list to show
     * @param {string=} options.itemColor the item color, optional, by default #000
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     */
    showActionSheet(options) {
        currProcessOption = options;
        if (!actionSheetElem) {
            actionSheetElem = createActionSheet();
        }

        // init action menu items
        let menuElem = actionSheetElem.querySelector(`.${ACTION_MENU_CLASS}`);
        let {itemList, itemColor} = options;
        menuElem.style.color = itemColor || '#000';
        menuElem.innerHTML = '';

        itemList.forEach((item, index) => {
            let elem = document.createElement('div');
            elem.className = ACTION_MENU_ITEM_CLASS;
            elem.dataset.tapIndex = index;
            elem.textContent = item;
            elem.onclick = handleItemClick;
            menuElem.appendChild(elem);
        });

        // show action sheet
        toggleMask(true);

        let menuWrap = menuElem.parentElement;
        menuWrap.className = ACTION_SHEET_CLASS + ' ' + ACTION_TOGGLE_CLASS;

        animationTimer && clearTimeout(animationTimer);
        animationTimer = null;
    }
};
