/**
 * @file The app API of the h5 app
 * @author sparklewhy@gmail.com
 */

'use strict';

import './ui/common/base.styl';
import selectorApi from './selector';
import systemApi from './system';
import requestApi from './request';
import routerApi from './router';
import storageApi from './storage';
import toastApi from './ui/toast';
import navApi from './navigator';
import phoneApi from './phone';
import networkApi from './network';
import windowApi from './window';
import animateApi from './animation';
import imgApi from './image';
import actionSheetApi from './ui/action';
import modalApi from './ui/modal';

export default Object.assign(
    selectorApi,
    systemApi,
    requestApi,
    routerApi,
    storageApi,
    toastApi,
    navApi,
    phoneApi,
    networkApi,
    windowApi,
    animateApi,
    imgApi,
    actionSheetApi,
    modalApi
);
