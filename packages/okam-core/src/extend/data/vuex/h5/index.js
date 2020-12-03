/**
 * @file Vuex support for h5 app
 * @author sparklewhy@gmail.com
 */

'use strict';

import Vue from 'vue';
import vuex from 'vuex';

function noop() {
    // do nothing
}

Vue.use(vuex);

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

            this.$fireStoreChange = noop;
            this.$subscribeStoreChange = noop;
            this.$unsubscribeStoreChange = noop;
            this.$store = store;
        },

        /**
         * The detached hook
         *
         * @private
         */
        detached() {
            this.$store = null;
        }
    }
};
