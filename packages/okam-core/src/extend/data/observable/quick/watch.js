/**
 * @file Enhanced quick app native $watch API to support deep and immediate options
 *       Currently deep watch is not supported in quick app
 * @author sparklewhy@gmail.com
 */

'use strict';

import {getDataByPath} from '../../../../helper/data';

function findChangedPath(ctx, newValue) {
    let computedInfo = ctx.$rawComputed || {};
    let allDataKeys = ctx.__allDataKeys;
    let dataKeys = [];
    allDataKeys.forEach(k => !computedInfo[k] && dataKeys.push(k));

    let findKeys = [{root: ctx, keys: dataKeys, path: ''}];
    while (findKeys.length) {
        let {path, root, keys} = findKeys.pop();
        for (let i = 0, len = keys.length; i < len; i++) {
            let k = keys[i];
            let value = root[k];
            let newPath = path ? `${path}.${k}` : k;
            if (value === newValue) {
                return newPath;
            }
            else if (value && typeof value === 'object') {
                let subKeys = Object.keys(value);
                subKeys.length && findKeys.push({
                    path: newPath,
                    root: value,
                    keys: subKeys
                });
            }
        }
    }
}

function getAddedProps(newValue, oldValue) {
    let newProps = Object.keys(newValue);
    if (!oldValue) {
        return newProps;
    }

    let result = [];
    newProps.forEach(p => {
        if (!oldValue.hasOwnProperty(p)) {
            result.push(p);
        }
    });

    return result;
}

function addWatcherDeep(ctx, currPath, handlerName) {
    let value = getDataByPath(ctx, currPath);
    if (value && typeof value === 'object') {
        Object.keys(value).forEach(k => {
            let newPath = currPath + '.' + k;
            ctx.__originalWatch(newPath, handlerName);
            addWatcherDeep(ctx, newPath, handlerName);
        });
    }
}

/**
 * Watch the given expression
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
export default function watchDataChange(expression, handlerName, options) {
    let {immediate, deep} = options || {};
    if (immediate) {
        let handler = this[handlerName];
        let value = getDataByPath(this, expression);
        handler.call(this, value);
    }

    if (deep) {
        let rawHandler = this[handlerName];
        let self = this;
        // override the watcher callback to ensure the watcher changed info
        // is the value of the watch path
        this[handlerName] = function (...args) {
            let newValue = args[0];
            let oldValue = args[1];
            if (newValue && typeof newValue === 'object') {
                let changedPath = findChangedPath(self, newValue);
                let addedProps = getAddedProps(newValue, oldValue);
                addedProps.forEach(p => {
                    let newPath = changedPath + '.' + p;
                    self.__originalWatch(newPath, handlerName);
                    addWatcherDeep(self, newPath, handlerName);
                });
            }

            let currValue = getDataByPath(self, expression);
            if (newValue !== currValue) {
                args[0] = args[1] = currValue;
            }
            return rawHandler.apply(this, args);
        };
        addWatcherDeep(this, expression, handlerName);
    }

    return this.__originalWatch(expression, handlerName);
}
