/**
 * @file OKAM component props helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-valid-map-set */

import {isPlainObject} from '../util/index';

function createPropError(msg) {
    let err = new Error(msg);
    err.isTypeError = true;
    return err;
}

/**
 * Normalize component props data using syntax in okam
 *
 * @param {Object} props the props data to normalize
 * @return {?Object}
 */
export function normalizeOkamProps(props) {
    if (!props) {
        return;
    }

    if (Array.isArray(props)) {
        let result = {};
        props.forEach(key => {
            if (typeof key !== 'string') {
                throw createPropError('props item required string');
            }
            result[key] = {type: null};
        });
        return result;
    }

    let result = {};
    Object.keys(props).forEach(k => {
        let propValue = props[k];
        // const VALIDATED_TYPES = [
        //     String, Number, Boolean, Array, Object, null
        // ];
        // if (VALIDATED_TYPES.indexOf(propValue) !== -1)
        // the above implementation will lead to the component properties data
        // missing in toutiao app, amazing thing...
        if (typeof propValue === 'function' || propValue === null) {
            result[k] = {type: propValue};
        }
        else if (Array.isArray(propValue)) { // support multiple types
            result[k] = propValue;
        }
        else {
            if (!isPlainObject(propValue)) {
                throw createPropError(`prop ${k} declaration require plain object or supported data type`);
            }

            let {default: value} = propValue;
            let propInfo = Object.assign({}, propValue);
            if (typeof value === 'function') {
                value = value();
                propInfo.default = value;
            }

            // if (type !== null && VALIDATED_TYPES.indexOf(type) === -1) {
            //     throw createPropError(`prop ${k} type is not supported`);
            // }
            result[k] = propInfo;
        }
    });
    return result;
}
