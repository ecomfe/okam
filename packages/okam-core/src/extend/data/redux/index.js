/**
 * @file Make the store observable
 *       Notice: this plugin should used after the observable plugin if using
 *       computed property
 * @author sparklewhy@gmail.com
 */

'use strict';

import connect from './connect';

function subscribeStoreChange() {
    if (this.__storeChangeHandler && !this.__unsubscribeStore) {
        this.__unsubscribeStore = this.$app.$store.subscribe(
            this.$fireStoreChange
        );
    }
}

function removeStoreChangeSubscribe() {
    let unsubscribe = this.__unsubscribeStore;
    if (unsubscribe) {
        unsubscribe();
        this.__unsubscribeStore = null;
    }
}

export default {
    component: {

        /**
         * Initialize component state and actions,
         * connect the store with the component.
         *
         * @private
         */
        $init() {
            let methods = this.methods;
            methods.__storeChangeHandler = connect(this);
        },

        /**
         * The created hook when component created
         *
         * @private
         */
        created() {
            let store = this.$app.$store;
            if (typeof store === 'function') {
                store = store.call(this);
            }

            /* istanbul ignore next */
            if (this.__storeChangeHandler) {
                this.$fireStoreChange = this.__storeChangeHandler.bind(this);
                this.__unsubscribeStore = store.subscribe(
                    this.$fireStoreChange
                );
                this.$subscribeStoreChange = subscribeStoreChange.bind(this);
                this.$unsubscribeStoreChange = removeStoreChangeSubscribe.bind(this);
            }
            this.$store = store;
            this.__state = store.getState();
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
            this.__state = null;
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
