/**
 * @file Make quick app support Vue filter template syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

export default {
    component: {

        /**
         * The instance initialization before the instance is normalized and created.
         *
         * @param {boolean} isPage whether is page component
         * @private
         */
        $init(isPage) {
            let filters = this.filters;
            if (!filters) {
                return;
            }

            Object.keys(filters).forEach(k => {
                let func = filters[k];
                this[`f_${k}`] = func;
            });
            delete this.filters;
        }
    }
};
