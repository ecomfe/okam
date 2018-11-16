/**
 * @file Make component support data operation like Vue for ant mini program
 * @author sparklewhy@gmail.com
 */

'use strict';

import observable, {setObservableContext} from '../index';
import {observableArray, overrideArrayMethods} from '../array';
import {component as antApi, array as antArray} from './array';

setObservableContext('props', true);

Object.assign(observable.component.methods, antApi);

let arrApis = Object.assign({}, observableArray, antArray);
overrideArrayMethods(arrApis, true);
overrideArrayMethods(arrApis, false);

/**
 * View update hook
 *
 * @private
 * @param {Object} prevProps the previous property data before update
 */
observable.component.didUpdate = function (prevProps) {
    let propObserver = this.__propsObserver;
    if (!propObserver) {
        return;
    }

    let currProps = this.props;
    // update the cache props data, as for the prop data will be override
    // when prop change, it leads to the cache props data will not refer to
    // the new props data
    propObserver.rawData = currProps;
    Object.keys(prevProps).forEach(k => {
        let newVal = currProps[k];
        let oldVal = prevProps[k];
        if (newVal !== oldVal) {
            propObserver.firePropValueChange(k, newVal, oldVal);
        }
    });
};

export default observable;
