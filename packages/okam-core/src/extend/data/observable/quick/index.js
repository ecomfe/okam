/**
 * @file Make component support data operation like Vue
 * @author sparklewhy@gmail.com
 */

'use strict';

import watchDataChange from './watch';

/**
 * Proxy data getter
 *
 * @inner
 * @param {Object} ctx the component instance
 * @param {string} prop the property name
 */
function proxyDataGetter(ctx, prop) {
    let proxyProps = ctx.__proxyProps;
    proxyProps || (proxyProps = ctx.__proxyProps = {});
    if (proxyProps[prop]) {
        return;
    }

    proxyProps[prop] = true;

    let descriptor = Object.getOwnPropertyDescriptor(ctx, prop);
    if (descriptor && descriptor.configurable) {
        let newDescriptor = Object.assign({}, descriptor, {
            get() {
                ctx.__deps && ctx.__deps.push(prop);
                return descriptor.get && descriptor.get.call(ctx);
            }
        });
        Object.defineProperty(ctx, prop, newDescriptor);
    }
    else {
        console.warn('cannot configure the data prop descriptor info:', prop);
    }
}

/**
 * Get inner watcher name
 *
 * @inner
 * @param {string} prop the watch prop name
 * @return {string}
 */
function getInnerWatcher(prop) {
    return `__watcher_${prop}`;
}

/**
 * Add data change watcher
 *
 * @inner
 * @param {Object} ctx the component instance
 * @param {string} prop the data prop name
 * @param {boolean=} deep whether watch deep
 */
function addDataChangeWatcher(ctx, prop, deep) {
    // in quick app, the watch handler does not support dynamic added methods
    // let handler = '__handleDataChange$' + prop;
    // ctx[handler] = (newVal, oldVal) => ctx.__handleDataChange(
    //     prop, newVal, oldVal
    // );

    // FIXME: array cannot support deep watch in quick app when change array item info
    let handlerName = getInnerWatcher(prop);
    watchDataChange.call(ctx, prop, handlerName, {deep});
}

/**
 * Collect the computed prop dependence data props
 *
 * @inner
 * @param {Object} ctx the component instance
 * @param {string} prop the computed prop name
 * @param {Function} getter the computed getter
 * @return {*}
 */
function collectComputedPropDeps(ctx, prop, getter) {
    ctx.__deps = [];
    let value = getter.call(ctx);
    ctx.__computedDeps[prop] = ctx.__deps;
    ctx.__deps = null;

    return value;
}

/**
 * Find the changed computed props
 *
 * @inner
 * @param {Object} allDeps all computed props deps info
 * @param {string} changeProp the changed prop name
 * @return {Array.<string>}
 */
function findChangeComputedProps(allDeps, changeProp) {
    let result = [];
    Object.keys(allDeps).forEach(k => {
        let depList = allDeps[k];
        if (k !== changeProp && depList.indexOf(changeProp) !== -1) {
            result.push(k);
        }
    });
    return result;
}

export default {
    component: {

        /**
         * Initialize the props to add observer to the prop to listen the prop change.
         *
         * @param {boolean} isPage whether is page component
         */
        $init(isPage) {
            let computed = this.computed;
            if (computed) {
                this.$rawComputed = () => computed;
                delete this.computed;
            }

            // collect all data, props and computed keys
            let data = this.data;
            if (typeof data === 'function') {
                data = data();
            }

            let dataKeys = data ? Object.keys(data) : [];
            let props = this.props;
            if (props) {
                Object.keys(props).forEach(k => {
                    if (dataKeys.indexOf(k) === -1) {
                        dataKeys.push(k);
                    }
                });
            }

            computed && Object.keys(computed).forEach(k => {
                if (dataKeys.indexOf(k) === -1) {
                    dataKeys.push(k);
                }
            });

            // init watcher
            // we must declare all watcher callback before defining component
            // as for it does not support dynamic watcher callback declaration
            // in quick app.
            dataKeys.forEach(k => {
                this[getInnerWatcher(k)] = function (newVal, oldVal) {
                    this.__handleDataChange(k, newVal, oldVal);
                };
            });

            this.__allDataKeys = () => dataKeys;
        },

        /**
         * The created hook
         *
         * @private
         */
        created() {
            this.__originalWatch = this.__originalWatch || this.$watch;
            let computedInfo = this.$rawComputed;
            if (typeof computedInfo === 'function') {
                this.$rawComputed = computedInfo = computedInfo();
            }

            // watch all data keys
            this.__allDataKeys = this.__allDataKeys();
            this.__allDataKeys.forEach(k => {
                let isComputedProp = computedInfo && computedInfo[k];
                addDataChangeWatcher(this, k, !isComputedProp);
                if (!isComputedProp) {
                    proxyDataGetter(this, k);
                }
            });

            // override $set API
            let rawSet = this.$set;
            this.$set = (...args) => {
                let k = args[0];

                if (this.__allDataKeys.indexOf(k) === -1) {
                    this.__allDataKeys.push(k);
                    // addDataChangeWatcher(this, k);
                }

                let result = rawSet.apply(this, args);
                proxyDataGetter(this, k);

                return result;
            };

            // add computed data
            this.__computedDeps = {};
            computedInfo && Object.keys(computedInfo).forEach(k => {
                let getter = computedInfo[k];
                let value = getter.call(this);
                this.$set(k, value);
            });

            // collect computed props deps
            computedInfo && Object.keys(computedInfo).forEach(
                k => collectComputedPropDeps(this, k, computedInfo[k])
            );
        },

        /**
         * Watch data change which support deep and immediate options
         *
         * @param {string} expression the expression to watch
         * @param {string} handlerName the callback handler name to execute when the
         *        expression value changes
         * @param {Object=} options watch options
         * @param {boolean=} options.immediate whether trigger the callback
         *        immediately with the current value of the expression or function
         *        optional, by default false
         * @param {boolean=} optional.deep whether watch object nested value
         *        optional, by default false
         * @return {*}
         */
        __watchDataChange: watchDataChange,

        /**
         * Add anonymous computed prop
         *
         * @protected
         * @param {Function} getter the computed getter
         * @return {string} the anonymous computed prop name
         */
        __addComputedProp(getter) {
            if (!this.__computedCounter) {
                this.__computedCounter = 1;
            }

            let prop = `__c${this.__computedCounter++}`;
            this.$rawComputed[prop] = getter;

            let value = getter.call(this);
            this.$set(prop, value);
            collectComputedPropDeps(this, prop, getter);

            return prop;
        },

        /**
         * Handle data change
         *
         * @private
         * @param {string} prop the changed prop name
         */
        __handleDataChange(prop) {
            let computedInfo = this.$rawComputed;
            if (!computedInfo) {
                return;
            }

            let computedGetter = computedInfo[prop];
            if (computedGetter) {
                // recollect computed prop deps
                collectComputedPropDeps(this, prop, computedGetter);
            }

            // up changed computed props
            let changeProps = findChangeComputedProps(
                this.__computedDeps, prop
            );
            changeProps.forEach(k => {
                let getter = computedInfo[k];
                let value = getter.call(this);
                this[k] = value;
            });
        },

        /**
         * Update computed property value
         *
         * @param {string} p the computed property name to update
         * @param {Function=} shouldUpdate whether should update the computed property
         */
        __updateComputed(p, shouldUpdate) {
            let old = this[p];

            // lazy computed is not supported
            let computedGetter = this.$rawComputed[p];
            let value = collectComputedPropDeps(this, p, computedGetter);
            // maybe the computed value is a reference of the dependence data,
            // so if the old === value && typeof old === 'object', it'll also need
            // to update view
            let neeUpdate = typeof shouldUpdate === 'function'
                ? shouldUpdate(old, value, p)
                : (old !== value || (typeof old === 'object'));
            if (neeUpdate) {
                this[p] = value;
            }
        }
    }
};
