/**
 * @file Create Fake Vue
 * @author sparklewhy@gmail.com
 */

import {appGlobal} from '../../../na/index';
import watch from '../watch/index';
import observable from '../observable/index';
import proxyArrayApis from '../observable/array';
import {addDep} from '../observable/helper';

const observableComp = observable.component;
const watchComp = watch.component;

let getCallbacks = [];
let setCallbacks = [];
function handleDataGetSet(isGet, paths, newVal, oldVal) {
    let callbacks;
    if (process.env.APP_TYPE === 'quick') {
        callbacks = isGet
            ? appGlobal.okamVuexGetCallbacks
            : appGlobal.okamVuexSetCallbacks;
    }
    else {
        callbacks = isGet ? getCallbacks : setCallbacks;
    }

    callbacks.forEach(item => item.call(null, paths, newVal, oldVal));
}

/* eslint-disable fecs-prefer-class */
/**
 * Create fake Vue context
 *
 * @param {Object} options the vue instance options
 * @return {Object}
 */
function Vue(options) {
    let instance = Object.assign({}, options, observableComp.methods, watchComp.methods);
    instance.created = observableComp.created;
    instance.$destroy = observableComp.detached;

    // do not call setData API as for it's only an observable data instance, no view
    instance.__setViewData = () => {};
    // do not initialize computed props when created
    instance.__lazyInitCompute = true;
    instance.__proxyArrayApis = proxyArrayApis;

    // avoid methods defined on methods, so here pass `true`
    observableComp.$init.call(instance, true);
    watchComp.$init.call(instance, true);

    instance.created();

    // define observable data and exported on `_data` attribute (Vuex need it)
    let data = {};
    let rawData = options && options.data;
    if (rawData) {
        let def = {};
        Object.keys(rawData).forEach(k => {
            let descriptor = Object.getOwnPropertyDescriptor(instance, k);
            def[k] = descriptor;
        });
        Object.defineProperties(data, def);
    }
    instance._data = data;

    // init inner data get/set listener
    instance.__onDataGet = handleDataGetSet.bind(instance, true);
    instance.__onDataSet = handleDataGetSet.bind(instance, false);

    if (process.env.APP_TYPE === 'quick') {
        if (!appGlobal.okamVuexGetCallbacks) {
            appGlobal.okamVuexGetCallbacks = [];
        }

        if (!appGlobal.okamVuexSetCallbacks) {
            appGlobal.okamVuexSetCallbacks = [];
        }
    }

    return instance;
}

Vue.version = '2.5.1';

Vue.options = {};

Vue.config = {
    silent: true
};

Vue.mixin = function (extension) {
};

Vue.nextTick = function (callback) {
    setTimeout(callback);
};

Vue.set = function (target, prop, value) {
    if (Array.isArray(target)) {
        target.length = Math.max(target.length, prop);
        target.splice(prop, 1, value);
        return value;
    }
    target[prop] = value;

    // dynamically add responsive object property is not supported
};

Vue.delete = function (target, prop) {
    if (Array.isArray(target)) {
        target.splice(prop, 1);
        return;
    }

    if (target.hasOwnProperty(prop)) {
        delete target[prop];
    }

    // dynamically delete responsive object property is not supported
};

Vue.use = function (plugin) {
    let args = [Vue];
    if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
    }
    else if (typeof plugin === 'function') {
        plugin.apply(null, args);
    }
};

Vue.initDataGetSet = function (instance, customAddDep) {
    if (process.env.APP_TYPE === 'quick') {
        getCallbacks = appGlobal.okamVuexGetCallbacks;
        setCallbacks = appGlobal.okamVuexSetCallbacks;
    }

    // init get/set callback
    const currGetCallback = paths => {
        let deps = instance.__deps;
        deps && (customAddDep || addDep)(deps, paths);
    };
    getCallbacks.push(currGetCallback);

    const currSetCallback = (paths, newVal, oldVal) => {
        let listener = instance && instance.__dataListener;
        listener && listener.emit('change', newVal, oldVal, paths);
    };
    setCallbacks.push(currSetCallback);

    // init callback dispose
    let removeSetGetListener = () => {
        let idx = getCallbacks.indexOf(currGetCallback);
        idx !== -1 && getCallbacks.splice(idx, 1);

        idx = getCallbacks.indexOf(currSetCallback);
        idx !== -1 && setCallbacks.splice(idx, 1);
    };
    let rawDetached = instance.detached;
    instance.detached = () => {
        removeSetGetListener();

        rawDetached && rawDetached.call(instance);
        instance = null;
    };

    return removeSetGetListener;
};

export default Vue;
