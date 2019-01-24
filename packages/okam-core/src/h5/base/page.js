/**
 * @file The quick app page base
 * @author sparklewhy@gmail.com
 */

'use strict';

import component from './component';

export default Object.assign({}, component, {

    /**
     * The instance initialization before the instance is normalized and created.
     *
     * @param {boolean} isPage whether is page component
     * @param {Object=} options the extra init options
     * @param {string=} options.dataAccessType the data access type
     * @private
     */
    $init(isPage, options) {
        let dataAccessType = options && options.dataAccessType;
        if (!dataAccessType) {
            dataAccessType = 'private';
        }
        this.dataAccessType = dataAccessType;
    },

    /**
     * Quick app init done hook
     *
     * @private
     */
    onInit() {
        this.$isPage = true;

        // init query info
        let queryProps = this.queryProps__;
        let propDescriptors = {};
        queryProps.forEach(k => {
            propDescriptors[k] = {
                get: () => this[k],
                enumerable: true
            };
        });
        this.$query = {};
        Object.defineProperties(this.$query, propDescriptors);

        // call component create life cycle method
        this.created();
    }
});
