/**
 * @file The semantic version utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

 /**
  * Compare the given versions, which one is latest.
  *
  * Return larger then 0, then the version v1 is newer than v2.
  * Return smaller than 0, then the version v1 is older then v2.
  * Return zero, then the version v1 is the same with the v2.
  *
  * @param {string} v1 the version to compare
  * @param {string} v2 the version to compare
  * @return {number}
  */
export function compare(v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.');
    let len = Math.max(v1.length, v2.length);

    while (v1.length < len) {
        v1.push('0');
    }

    while (v2.length < len) {
        v2.push('0');
    }

    for (let i = 0; i < len; i++) {
        let num1 = parseInt(v1[i], 10);
        let num2 = parseInt(v2[i], 10);

        if (num1 > num2) {
            return 1;
        }
        else if (num1 < num2) {
            return -1;
        }
    }

    return 0;
}

/**
 * Whether the version v1 is newer than version v2.
 *
 * @param {string} v1 the version to compare
 * @param {string} v2 the version to compare
 * @return {boolean}
 */
export function gt(v1, v2) {
    return compare(v1, v2) > 0;
}

/**
 * Whether the version v1 is older than version v2.
 *
 * @param {string} v1 the version to compare
 * @param {string} v2 the version to compare
 * @return {boolean}
 */
export function lt(v1, v2) {
    return compare(v1, v2) < 0;
}

/**
 * Whether the version v1 is the same with version v2.
 *
 * @param {string} v1 the version to compare
 * @param {string} v2 the version to compare
 * @return {boolean}
 */
export function eq(v1, v2) {
    return compare(v1, v2) === 0;
}
