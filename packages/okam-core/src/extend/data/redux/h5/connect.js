/**
 * @file Connect the store with the component for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-prefer-destructure */

function normalizeStoreComputed(stateMap) {
    let computed;
    if (Array.isArray(stateMap)) {
        computed = stateMap.reduce((prev, curr) => {
            prev[curr] = state => state[curr];
            return prev;
        }, {});
    }
    else if (stateMap) {
        computed = Object.keys(stateMap).reduce((prev, curr) => {
            let value = stateMap[curr];
            let valueType = typeof value;
            if (valueType === 'string') {
                prev[curr] = state => state[value];
            }
            else if (valueType === 'function') {
                prev[curr] = value;
            }
            return prev;
        }, {});
    }

    let computedData;
    if (computed) {
        computedData = {};
        Object.keys(computed).forEach(
            k => {
                let getter = computed[k];
                computedData[`${k}_$$`] = function () {
                    let state = this.$store.getState();
                    return getter.call(this, state);
                };
                computed[k] = function () {
                    return this[`${k}_$$`];
                };
            }
        );
    }

    return {
        computed,
        computedData
    };
}

function normalizeStoreActions(actionMap) {
    if (!actionMap) {
        return;
    }

    let toAction = actionMap;
    if (Array.isArray(actionMap)) {
        let fromAction = actionMap[0];
        toAction = actionMap[1];

        if (Array.isArray(toAction)) {
            toAction = toAction.reduce((prev, curr) => {
                prev[curr] = fromAction[curr];
                return prev;
            }, {});
        }
        else {
            toAction = Object.keys(toAction).reduce((prev, key) => {
                let value = toAction[key];
                let valueType = typeof value;
                if (valueType === 'string') {
                    prev[key] = fromAction[value];
                }
                else if (valueType === 'function') {
                    prev[key] = value;
                }
                return prev;
            }, {});
        }
    }

    toAction && Object.keys(toAction).forEach(k => {
        let act = toAction[k];
        toAction[k] = function (...args) {
            this.$store.dispatch(act.apply(null, args));
        };
    });
    return toAction;
}

function onStoreChange() {
    this.__updateComputed();
}

export default function connect(component) {
    let store = component.$store;
    if (!store) {
        return;
    }

    // init store computed state
    let {
        computed: storeComputed,
        computedData: storeComputedData
    } = normalizeStoreComputed(store && store.computed);
    if (storeComputed) {
        let computed = component.computed;
        computed || (component.computed = computed = {});
        Object.assign(computed, storeComputed);

        let componentData = component.data;
        component.data = function () {
            if (typeof componentData === 'function') {
                componentData = componentData.call(this);
            }

            let extendData = {};
            Object.keys(storeComputedData).forEach(k => (extendData[k] = ''));
            return Object.assign({}, componentData, extendData);
        };
    }

    // init store mutation actions
    let actions = normalizeStoreActions(store && store.actions);
    let methods = component.methods;
    methods || (component.methods = methods = {});
    actions && Object.assign(methods, actions);
    storeComputedData && (component.__storeComputedData = storeComputedData);

    return onStoreChange;
}
