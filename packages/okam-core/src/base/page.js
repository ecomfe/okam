/**
 * @file The page base
 * @author sparklewhy@gmail.com
 */

'use strict';

import component from './component';

export default Object.assign({}, component, {

    /**
     * The onLoad hook triggered when page on load.
     *
     * @private
     * @param {Object} query the page query params
     */
    onLoad(query) {
        this.$isPage = true;
        this.$query = query || {};

        // call component create life cycle method
        this.created();
    },

    /**
     * The ready hook triggered when paged is ready.
     *
     * @private
     */
    onReady() {
        // call component attached/ready life cycle method
        this.attached();
        this.ready();
    },

    /**
     * The unload hook triggered when page is unload.
     *
     * @private
     */
    onUnload() {
        // call component detach life cycle method
        this.detached();
    },

    methods: Object.assign(
        {}, component.methods
    )
});
