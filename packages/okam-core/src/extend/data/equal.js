/**
 * @file Check the changed value is equal
 *       For weixin, it'll deeply copy the assignment data to the changed property.
 *       e.g.,
 *       <code>
 *       let newObj = {a: 3};
 *       this.setData({info: newObj}, () => {
 *          this.data.info === newObj; // false, for swan/ant here is true
 *       });
 *       this.data.info === newObj; // false, for swan/ant here is true
 *       </code>
 * @author sparklewhy@gmail.com
 */

'use strict';

import {isPlainObject} from '../../util/index';

function isShadowEqual(obj1, obj2) {
    let keys = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    if (keys.length !== keys2.length) {
        return false;
    }

    return !keys.some(k => {
        if (obj1[k] !== obj2[k]) {
            return true;
        }
        return false;
    });
}

function isArrayValueEqual(arr1, arr2) {
    let len = arr1.length;
    if (len !== arr2.length) {
        return false;
    }

    for (let i = 0; i < len; i++) {
        let item1 = arr1[i];
        let item2 = arr2[i];
        if (!isValueEqual(item1, item2)) {
            return false;
        }
    }

    return true;
}

export default function isValueEqual(old, curr) {
    if (old === curr) {
        return true;
    }

    if (isPlainObject(old) && isPlainObject(curr)) {
        return isShadowEqual(old, curr);
    }

    if (Array.isArray(old) && Array.isArray(curr)) {
        return isArrayValueEqual(old, curr);
    }

    return false;
}
