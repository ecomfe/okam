/**
 * @file Make the store observable
 *       Notice: this plugin should used after the observable plugin if using
 *       computed property
 * @author sparklewhy@gmail.com
 */

'use strict';

import connect from './connect';

function onShow() {
    if (this.__storeChangeHandler && !this.__unsubscribeStore) {
        this.__unsubscribeStore = this.$app.$store.subscribe(
            this.__storeChangeHandler.bind(this)
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
            if (this.__storeChangeHandler) {
                this.__unsubscribeStore = store.subscribe(
                    this.__storeChangeHandler.bind(this)
                );
            }
            this.$store = store;
            this.__state = store.getState();
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
            this.__state = null;
            this.$store = null;
        }
    }
};
