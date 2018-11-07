/**
 * @file Support $refs property to get the reference instance in template
 * @author sparklewhy@gmail.com
 */

'use strict';

import {normalizeExtendProp} from '../helper/methods';

/**
 * Query the reference instance information by the given reference class
 *
 * @inner
 * @param {string|Array.<string>} value the reference class
 * @return {?Object|Array}
 */
function queryRefInstance(value) {
    let isSelectAll = Array.isArray(value);
    let result;

    if (isSelectAll) {
        let path = `.${value[0]}`;
        if (typeof this.selectAllComponents === 'function') {
            result = this.selectAllComponents(path);
        }

        if (!result || !result.length) {
            result = this.$selector.selectAll(path);
        }
    }
    else {
        let path = `.${value}`;
        if (typeof this.selectComponent === 'function') {
            result = this.selectComponent(path);
        }

        if (!result) {
            // if not custom component, try to query element info by selector API
            result = this.$selector.select(path);
        }
    }

    return result;
}

/**
 * Initialize the `$refs` value
 *
 * @inner
 */
function initRefs() {
    this.$refs = {};

    let refs = this.$rawRefData;
    if (typeof refs === 'function') {
        refs = refs();
    }

    if (!refs) {
        return;
    }

    let result = {};
    const self = this;
    Object.keys(refs).forEach(id => {
        result[id] = {
            get() {
                let value = refs[id];
                return queryRefInstance.call(self, value);
            },
            enumerable: true
        };
    });

    Object.defineProperties(this.$refs, result);
}

export default {
    component: {

        /**
         * The instance initialization before the instance is normalized and created.
         *
         * @param {boolean} isPage whether is page component
         * @param {Object} refData the reference information
         * @private
         */
        $init(isPage, refData) {
            if (!refData) {
                return;
            }

            this._refData = refData;
            normalizeExtendProp(this, '_refData', '$rawRefData', isPage);
        },

        /**
         * The created hook
         *
         * @private
         */
        created() {
            // init component refs
            initRefs.call(this);
        }
    }
};
