/**
 * @file The swan observable plugin for test
 * @author sparklewhy@gmail.com
 */

'use strict';

import observable from 'core/extend/data/observable/index';
import {observableArray, extendArrayMethods} from 'core/extend/data/observable/array';
import {component as swanApi, array as swanArray} from 'core/extend/data/observable/swan/array';

export const swanObservablePlugin = Object.assign({}, observable);
swanObservablePlugin.component.methods = Object.assign(
    {}, swanObservablePlugin.component.methods, swanApi
);

export function initSwanObservableArray() {
    extendArrayMethods(Object.assign(
        {}, observableArray, swanArray
    ), true);
}

export function resetObservableArray() {
    extendArrayMethods(observableArray, true);
}
