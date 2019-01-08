/**
 * @file Support $refs property to get the reference instance in template
 *       for quick app.
 *       NOTICE: currently, the ref implementation is based on $child API, so
 *       refer the component type that has multiple instances is not supported.
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * Query component instance by the given id
 *
 * @inner
 * @param {Object} ctx the component context
 * @param {string} id the component reference id
 * @return {?Object}
 */
function queryComponentInstance(ctx, id) {
    let isSelectAll = Array.isArray(id);
    isSelectAll && (id = id[0]);

    // query multiple components is not supported
    let key = id.substr(1);
    return ctx.$child(key);
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
    Object.keys(refs).forEach(id => {
        result[id] = {
            get: queryComponentInstance.bind(null, this, refs[id]),
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

            this.$rawRefData = () => refData;
        },

        /**
         * The attached hook
         * Cannot using created(onInit) hook, as for cannot access
         * user defined methods at this moment.
         *
         * @private
         */
        created() {
            // init component refs
            initRefs.call(this);
        },

        /**
         * The hook when component detached
         *
         * @private
         */
        detached() {
            this.$refs = null;
        }
    }
};
