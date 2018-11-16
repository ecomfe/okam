/**
 * @file The utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-use-for-of */

const toString = Object.prototype.toString;

/**
 * Check the given value whether is plain object type
 *
 * @param {*} obj the value to check
 * @return {boolean}
 */
export function isPlainObject(obj) {
    return toString.call(obj) === '[object Object]';
}

/**
 * Check the given value whether is object type except for null
 *
 * @param {*} v the value to check
 * @return {boolean}
 */
export function isObject(v) {
    return v && typeof v === 'object';
}

/**
 * Check the given value whether is function type
 *
 * @param {*} v the value to check
 * @return {boolean}
 */
export function isFunction(v) {
    return typeof v === 'function';
}

function overrideFunc(parentFunc, childFunc) {
    return function (...args) {
        parentFunc.apply(this, args);
        return childFunc.apply(this, args);
    };
}

function doMixin(target, source) {
    for (let k in source) {
        /* istanbul ignore next */
        if (source.hasOwnProperty(k)) {
            let sValue = source[k];
            let currValue = target[k];

            if (isFunction(sValue) && isFunction(currValue)) {
                target[k] = overrideFunc(sValue, currValue);
            }
            else if (isPlainObject(sValue) && isPlainObject(currValue)) {
                target[k] = Object.assign({}, sValue, currValue);
            }
            else if (!target.hasOwnProperty(k)) {
                target[k] = isPlainObject(sValue)
                    ? Object.assign({}, sValue) : sValue;
            }
        }
    }
}

/**
 * Mixin the given sources to the target.
 * If the target has the prop, then the target will override the sources.
 * If the target and sources prop value is both plain object will mixin.
 * If the target and sources prop value is both function type, it'll create a new function,
 * the function will call sources first(parent), then call target(child).
 *
 * The mixin is shadow mixin, it means that only the first level props of the target will mixin.
 * e.g., mixin({a: 3, b: {c: 5, d: {e: 2}}}, {a: 5, b: {d: {k: 5}, k: 5}, c: 10});
 * the result is {a: 3, b: {c: 5, d: {e: 2}, k: 5}, c: 10}
 * the value of b.d will not mixin.
 *
 * @param {Object} target the mixin target
 * @param {...Object} sources the sources to mixin
 * @return {Object}
 */
export function mixin(target, ...sources) {
    sources.forEach(item => doMixin(target, item));
    return target;
}

/**
 * Check the given object whether is Promise instance
 *
 * @param {Object} obj the object to check
 * @return {boolean}
 */
export function isPromise(obj) {
    return obj && typeof obj.then === 'function' && typeof obj.catch === 'function';
}

/**
 * Check the given property whether is writable in the given object.
 *
 * @param {Object} obj the object tho check
 * @param {string} name the property name to check
 * @return {boolean}
 */
export function isPropertyWritable(obj, name) {
    let result = Object.isFrozen(obj);
    if (result) {
        return false;
    }

    let desc = Object.getOwnPropertyDescriptor(obj, name);
    desc ? (result = !!desc.set || desc.writable) : (result = true);
    return result;
}

/**
 * Define property value
 *
 * @param {Object} obj the object to define property
 * @param {string} name the property name
 * @param {*} value the property value to define
 */
export function definePropertyValue(obj, name, value) {
    let desc = Object.getOwnPropertyDescriptor(obj, name);
    if (desc && !desc.configurable) {
        obj[name] = value;
        return;
    }

    desc || (desc = {enumerable: true, configurable: true});
    if (desc.get) {
        desc.get = () => value;
    }
    else {
        desc.value = value;
    }

    Object.defineProperty(obj, name, desc);
}
