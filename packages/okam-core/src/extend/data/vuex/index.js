/**
 * @file Make the store observable
 *       Notice: this plugin should used after the observable plugin if using
 *       computed property
 * @author sparklewhy@gmail.com
 */

'use strict';

import Vuex from 'vuex';
import Vue from './Vue';
import isValueEqual from '../equal';

function onShow() {
    let computedKeys = Object.keys(this.$rawComputed || {});
    if (computedKeys.length && !this.__unsubscribeStore) {
        this.__unsubscribeStore = this.$store.subscribe(
            this.$fireStoreChange
        );
    }
}

function onHide() {
    let unsubscribe = this.__unsubscribeStore;
    if (unsubscribe) {
        unsubscribe();
        this.__unsubscribeStore = null;
    }
}

function shouldUpdate(old, curr) {
    return !isValueEqual(old, curr);
}

function onStoreChange() {
    let upKeys = Object.keys(this.$rawComputed || {});
    let updateComputed = this.__updateComputed;
     /* istanbul ignore next */
    if (updateComputed && upKeys) {
        upKeys.forEach(k => updateComputed.call(this, k, shouldUpdate));
    }
}

// should use it at first, vuex store should be created after vuex plugin is enabled
Vue.use(Vuex);

export default {

    component: {

        /**
         * The created hook when component created
         *
         * @private
         */
        beforeCreate() {
            let store = this.$app.$store;
            this.$fireStoreChange = onStoreChange.bind(this);
            this.$store = store;

            let computedInfo = this.$rawComputed || {};
            if (typeof computedInfo === 'function') {
                this.$rawComputed = computedInfo = computedInfo();
            }

            let computedKeys = Object.keys(this.$rawComputed || {});
            if (computedKeys.length) {
                this.__unsubscribeStore = store.subscribe(
                    this.$fireStoreChange
                );
            }
        },

        /**
         * OnShow hook for page component
         *
         * @private
         */
        onShow() {
            onShow.call(this);
        },

        /**
         * OnHide hook for page component
         *
         * @private
         */
        onHide() {
            onHide.call(this);
        },

        /**
         * Page lifetimes hook for component
         *
         * @private
         */
        pageLifetimes: {
            show: onShow,
            hide: onHide
        },

        /**
         * The detached hook
         *
         * @private
         */
        detached() {
            onHide.call(this);
            this.$store = null;
        }
    }
};
