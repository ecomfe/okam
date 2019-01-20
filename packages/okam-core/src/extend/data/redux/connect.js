/**
 * @file Connect the store with the component
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-prefer-destructure */

import isValueEqual from '../equal';

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

    if (computed) {
        Object.keys(computed).forEach(
            k => {
                let getter = computed[k];
                computed[k] = function () {
                    let state = this.$store.getState();
                    return getter.call(this, state);
                };
            }
        );
    }

    return computed;
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

function shouldUpdate(old, curr) {
    return !isValueEqual(old, curr);
}

function onStoreChange() {
    let upKeys = this.__storeComputedKeys;
    let updateComputed = this.__updateComputed;
    if (typeof upKeys === 'function') {
        this.__storeComputedKeys = upKeys = upKeys();
    }

    if (updateComputed && upKeys) {
        upKeys.forEach(k => updateComputed.call(this, k, shouldUpdate));
    }
}

export default function connect(component) {
    let store = component.$store;
    if (!store) {
        return;
    }

    // init store computed state
    let storeComputed = normalizeStoreComputed(store && store.computed);
    let computed = component.computed;
    computed || (component.computed = computed = {});
    storeComputed && Object.assign(computed, storeComputed);

    // init store mutation actions
    let actions = normalizeStoreActions(store && store.actions);
    let methods = component.methods;
    methods || (component.methods = methods = {});
    actions && Object.assign(methods, actions);
    storeComputed && (methods.__storeComputedKeys = () => Object.keys(storeComputed));

    return onStoreChange;
}
