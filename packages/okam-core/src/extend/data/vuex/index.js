/**
 * @file Make the store observable
 *       Notice: this plugin should used after the observable plugin if using
 *       computed property
 * @author sparklewhy@gmail.com
 */

'use strict';

import Vuex from 'vuex';
import Vue from './Vue';

function subscribeStoreChange() {
    let computedKeys = Object.keys(this.$rawComputed || {});
    if (computedKeys.length && !this.__unsubscribeStore) {
        this.__unsubscribeStore = Vue.initDataGetSet(this);
    }
}

function removeStoreChangeSubscribe() {
    let unsubscribe = this.__unsubscribeStore;
    if (unsubscribe) {
        unsubscribe();
        this.__unsubscribeStore = null;
    }
}

function onStoreChange() {
    let upKeys = Object.keys(this.$rawComputed || {});
    let updateComputed = this.__updateComputed;
    /* istanbul ignore next */
    if (updateComputed && upKeys) {
        upKeys.forEach(k => updateComputed.call(this, k));
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
            if (typeof store === 'function') {
                store = store.call(this);
            }

            this.$fireStoreChange = onStoreChange.bind(this);
            this.$subscribeStoreChange = subscribeStoreChange.bind(this);
            this.$unsubscribeStoreChange = removeStoreChangeSubscribe.bind(this);
            this.$store = store;

            let computedInfo = this.$rawComputed || {};
            if (typeof computedInfo === 'function') {
                this.$rawComputed = computedInfo = computedInfo();
            }

            subscribeStoreChange.call(this);
        },

        /**
         * Page lifetimes hook for component
         *
         * @private
         */
        pageLifetimes: {
            show: subscribeStoreChange,
            hide: removeStoreChangeSubscribe
        },

        /**
         * The detached hook
         *
         * @private
         */
        detached() {
            removeStoreChangeSubscribe.call(this);
            this.$store = null;
        }
    },

    page: {

        /**
         * OnShow hook for page component
         *
         * @private
         */
        onShow() {
            subscribeStoreChange.call(this);
        },

        /**
         * OnHide hook for page component
         *
         * @private
         */
        onHide() {
            removeStoreChangeSubscribe.call(this);
        }
    }
};
