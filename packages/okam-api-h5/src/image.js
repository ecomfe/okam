/**
 * @file Image API for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global document:false */
/* global Blob:false */
/* global Image:false */

import {processAsyncApiCallback} from './helper';
import {callback} from './util';

const IMG_SELECT_INPUT_ID = 'okam-image-api-select';

const ERROR_CODE = {
    PARSE_ERROR: 202,
    UNKNOW_ERROE: 1003
};

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
    },


    /**
     * getImageInfo API
     *
     * @param {Object} options the options
     * @param {string} options.src the src of images
     * @param {Function=} options.success the successful callback
     * @param {Function=} options.complete the done callback
     * @param {Function=} options.fail the fail callback
     */
    getImageInfo(options = {}) {
        const {
            src,
            success,
            fail,
            complete
        } = options;

        if (!src) {
            const err = {
                errCode: ERROR_CODE.UNKNOW_ERROE,
                errMsg: 'src is required and must be "string"'
            };
            callback(fail, err);
            callback(complete);
        }

        const imgTypes = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'];
        const imgType = src.substr(src.lastIndexOf('.') + 1) || '';
        const img = new Image();
        img.onload = function (e) {
            const imageInfo = {
                path: src,
                width: e.target.naturalWidth || e.target.width,
                height: e.target.naturalHeight || e.target.height,
                type: imgTypes.indexOf(imgType) > -1 ? imgType : null,
                orientation: 'up'
            };
            callback(success, imageInfo);
            callback(complete);
        };
        img.onerror = e => {
            callback(fail, e);
            callback(complete);
        };
        img.src = src;
    },

    /**
     * previewImage API
     *
     * @param {Object} options the options
     * @param {string=} options.current the current image's url
     * @param {Array} options.urls the image list
     * @param {Function=} options.success the successful callback
     * @param {Function=} options.complete the done callback
     * @param {Function=} options.fail the fail callback
     */
    previewImage(options = {}) {
        const {
            current,
            urls,
            success,
            fail,
            complete
        } = options;

        if (!urls || !urls.length) {
            const err = {
                errCode: 904,
                errMsg: '[jsNative Argument Error]urls is required.'
            };
            callback(fail, err);
            throw new Error(err.errMsg);
        }

        const urlsCount = urls.length;

        const swiperStyle = `
            position: 'fixed',
            zIndex: 10000,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#000',
            overflow: 'hidden'
        `;

        const swiperWrapperStyle = `
            position: 'absolute',
            top: 0,
            left: 0,
            width: ${urlsCount} + '00%',
            height: '100%'
        `;

        const swiperItemSyle = `
            position: 'relative',
            float: 'left',
            width: ${100 / urlsCount} + '%',
            height: '100%',
            display: 'flex',
            background: 'url(https://mms-graph.cdn.bcebos.com/activity/mp_loading.gif) no-repeat center',
            backgroundSize: '30px auto'
        `;
        const swiperDom = document.createElement('div');
        swiperDom.className = 'okam-swiper';
        swiperDom.style.cssText += swiperStyle;

        const swiperWrapperDom = document.createElement('div');
        swiperWrapperDom.className = 'okam-swiper-wrapper';
        swiperWrapperDom.style.cssText += swiperWrapperStyle;

        Array.prototype.forEach.call(urls, url => {
            const swiperItemDom = document.createElement('div');
            swiperItemDom.className = 'okam-swiper-item';
            swiperItemDom.style.cssText += swiperItemSyle;

            swiperItemDom.addEventListener('click', e => {
                swiperDom.remove();
            }, false);

            const imgStyle = `
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'none'
            `;
            const img = document.createElement('img');
            img.style.cssText += imgStyle;
            img.src = url;

            img.onload = e => {
                const imgRatio = img.height / img.width;
                const {offsetHeight = 0, offsetWidth = 0} = swiperDom;
                const imgRealWidth = offsetHeight / imgRatio;
                const imgRealHeight = offsetWidth * imgRatio;
                const swiperDomRatio = offsetHeight / offsetWidth;

                if (imgRatio > swiperDomRatio) {
                    img.style.height = offsetHeight + 'px';
                    img.style.width = imgRealWidth + 'px';
                    img.style.left = (offsetWidth - imgRealWidth) / 2 + 'px';
                }
                else {
                    img.style.width = offsetWidth + 'px';
                    img.style.height = imgRealHeight + 'px';
                    img.style.top = (offsetHeight - imgRealHeight) / 2 + 'px';
                }

                img.style.display = 'block';
            };
            swiperItemDom.appendChild(img);
            swiperWrapperDom.appendChild(swiperItemDom);
        });

        // progress bar
        const swiperProgressStyle = `
            position: 'absolute',
            left: '17px',
            bottom: '20px',
            fontSize: '14px',
            color: '#fff',
            text-shadow: '1px 1px 3px #000'
        `;

        const swiperProgress = document.createElement('label');
        swiperProgress.className = 'okam-swiper-progress';
        swiperProgress.style.cssText += swiperProgressStyle;

        swiperDom.appendChild(swiperWrapperDom);
        swiperDom.appendChild(swiperProgress);
        document.body.appendChild(swiperDom);

        // get the current image's indice
        const currentImageIndex = urls.indexOf(current) > -1 ? urls.indexOf(current) : 0;
        swiperProgress.innerHTML = (currentImageIndex + 1) + '/' + urlsCount;

        const swiperOffsetWidth = swiperDom.offsetWidth;
        const initOffset = -swiperOffsetWidth * currentImageIndex;
        swiperWrapperDom.style.left = initOffset + 'px';

        // touches events
        const touches = {
            startX: 0,
            oriStartX: 0,
            sliding: false,
            transformX: initOffset,
            lastTransformX: 0,
            transition: '0.32s ease-in-out',
            slideLimit: [0, swiperOffsetWidth * (urlsCount - 1)]
        };

        swiperWrapperDom.addEventListener('touchstart', e => {
            if (touches.sliding) {
                return;
            }
            touches.startX = e.touches[0].pageX || e.touches[0].clientX;
            touches.oriStartX = e.touches[0].pageX || e.touches[0].clientX;
        }, false);

        swiperWrapperDom.addEventListener('touchmove', e => {
            if (touches.sliding) {
                return;
            }
            const moveX = e.touches[0].pageX || e.touches[0].clientX;
            touches.transformX += moveX - touches.startX;

            if (touches.transformX > touches.slideLimit[0]) {
                touches.transformX = 0;
            }
            else if (touches.transformX < -touches.slideLimit[1]) {
                touches.transformX = -touches.slideLimit[1];
            }
            else {}
            swiperWrapperDom.style.left = touches.transformX + 'px';
            touches.startX = moveX;
        }, false);

        swiperWrapperDom.addEventListener('touchend', e => {
            if (touches.sliding) {
                return;
            }
            const endX = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
            const distX = endX - touches.oriStartX;
            const swiperDomOffsetWidth = swiperDom.offsetWidth;

            if (Math.abs(distX) < 30) {
                touches.transformX = touches.lastTransformX;
            }
            else {
                const passX = Math.abs(touches.transformX) / swiperDomOffsetWidth;
                const slideTo = distX < 0 ? Math.ceil(passX) : Math.floor(passX);

                swiperProgress.innerHTML = (slideTo + 1) + '/' + urlsCount;
                touches.transformX = -swiperDomOffsetWidth * slideTo;
            }
            swiperWrapperDom.style.transition = touches.transition;
            swiperWrapperDom.style.left = touches.transformX + 'px';
            touches.sliding = true;
            setTimeout(_ => {
                swiperWrapperDom.style.transition = 'none';
                touches.lastTransformX = touches.transformX;
                touches.sliding = false;
            }, 320);
        }, false);

        callback(success, {});
        callback(complete, {});
    }
};
