/**
 * @file Support $refs property to get the reference instance in template
 * @author sparklewhy@gmail.com
 */

'use strict';

import {normalizeExtendProp} from '../../helper/methods';

/**
 * Query the reference instance information by the given reference class
 *
 * @inner
 * @param {string|Array.<string>} selector the reference class or id selector
 * @return {?Object|Array}
 */
function queryRefInstance(selector) {
    let isSelectAll = Array.isArray(selector);
    isSelectAll && (selector = selector[0]);

    let result;
    if (isSelectAll) {
        if (typeof this.selectAllComponents === 'function') {
            result = this.selectAllComponents(selector);
        }
        result || (result = []);
    }
    else if (typeof this.selectComponent === 'function') {
        result = this.selectComponent(selector);
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
         * @param {Object=} options the extra init options
         * @param {Object=} options.refs the component reference used in the
         *        component, the reference information is defined in the template
         * @private
         */
        $init(isPage, options) {
            let refData = options && options.refs;
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
