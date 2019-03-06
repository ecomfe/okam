/**
 * @file Image API for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global document:false */
/* global Blob:false */

import {processAsyncApiCallback} from './helper';

const IMG_SELECT_INPUT_ID = 'okam-image-api-select';

function createFileSelectElem() {
    let elem = document.createElement('input');
    elem.setAttribute('type', 'file');
    elem.setAttribute('id', IMG_SELECT_INPUT_ID);
    elem.setAttribute('multiple', 'multiple');
    elem.setAttribute('accept', 'image/*');
    elem.setAttribute('style', 'position: fixed; top: -1000px; left: -1000px; z-index: -1000;');
    document.body.appendChild(elem);
    return elem;
}

function getImgData(e) {
    let tempFilePaths = [];
    let tempFiles = [];
    let arr = Array.prototype.slice.call(e.target.files);
    arr && arr.forEach(item => {
        let blob = new Blob([item]);
        let url = URL.createObjectURL(blob);
        tempFilePaths.push(url);
        tempFiles.push({path: url, size: item.size, type: item.type});
    });
    return {tempFilePaths, tempFiles};
}

export default {

    /**
     * Choose image
     *
     * @param {Object} options the choose options
     * @param {Function=} options.success the choose image successful callback
     * @param {Function=} options.complete the choose image done callback
     * @param {Function=} options.fail the choose image fail callback
     */
    chooseImage(options) {
        let fileInput = document.getElementById(IMG_SELECT_INPUT_ID);
        if (!fileInput) {
            fileInput = createFileSelectElem();
        }

        fileInput.onchange = function (e) {
            processAsyncApiCallback(
                'chooseImage',
                getImgData.bind(null, e), [],
                options, true
            );
        };

        let mouseEvent = document.createEvent('MouseEvents');
        mouseEvent.initEvent('click', true, true);
        fileInput.dispatchEvent(mouseEvent);
    }
};
