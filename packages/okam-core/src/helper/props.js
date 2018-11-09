/**
 * @file OKAM component props helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-valid-map-set */

import {isPlainObject} from '../util/index';

const VALIDATED_TYPES = [
    String, Number, Boolean, Array, Object, null
];

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
        if (VALIDATED_TYPES.indexOf(propValue) !== -1) {
            result[k] = {type: props[k]};
        }
        else {
            if (!isPlainObject(propValue)) {
                throw createPropError(`prop ${k} value require plain object or supported data type`);
            }

            let {type, observer, default: value} = propValue;
            if (typeof value === 'function') {
                value = value();
            }

            if (type !== null && VALIDATED_TYPES.indexOf(type) === -1) {
                throw createPropError(`prop ${k} type is not supported`);
            }

            let item = {type};
            value !== undefined && (item.default = value);
            observer && (item.observer = observer);
            result[k] = item;
        }
    });
    return result;
}
