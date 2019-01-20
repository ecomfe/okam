/**
 * @file Create Fake Vue
 * @author wuhuiyao@baidu.com
 */

import watch from '../watch/index';
import observable from '../observable/index';
import proxyArrayApis from '../observable/array';

const observableComp = observable.component;
const watchComp = watch.component;

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

export default Vue;
