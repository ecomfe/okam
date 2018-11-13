/**
 * @file The swan observable plugin for test
 * @author sparklewhy@gmail.com
 */

'use strict';

import {observableArray, overrideArrayMethods} from 'core/extend/data/observable/array';
import {array as antArray} from 'core/extend/data/observable/ant/array';
import antComponent from 'core/ant/base/component';

export function initAntObservableArray() {
    let arrApis = Object.assign({}, observableArray, antArray);
    overrideArrayMethods(arrApis, true);
    overrideArrayMethods(arrApis, false);
}

export function resetObservableArray() {
    overrideArrayMethods(observableArray, true);
    overrideArrayMethods(observableArray, false);
}

export function fakeAntArrayAPIs() {
    const componentFakeMethods = [
        '$spliceData'
    ];
    const rawComponentMethods = [];
    componentFakeMethods.forEach(
        m => rawComponentMethods.push(antComponent[m])
    );

    componentFakeMethods.forEach(
        m => {
            antComponent[m] = (...args) => {
                let callback = args[args.length - 1];
                if (typeof callback === 'function') {
                    setTimeout(() => callback(), 0);
                }
            };
        }
    );

    return () => {
        componentFakeMethods.forEach(
            (m, idx) => (antComponent[m] = rawComponentMethods[idx])
        );
    };
}
