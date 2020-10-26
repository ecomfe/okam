/**
 * @file Form field mixin
 * @author sparlewhy@gmail.com
 */

'use strict';

export default {
    mounted() {
        this.$isFormField = true;
    },

    methods: {
        getFieldValue() {
            // form field need to implement
        },

        resetFieldValue() {
            // form field need to implement
        }
    }
};
