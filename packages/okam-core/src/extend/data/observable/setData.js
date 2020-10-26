/**
 * @file Optimize set data queues
 * @author sparklewhy@gmail.com
 */

'use strict';

const ARRAY_INDEX_ACCESS_REGEXP = /\[\d+\]$/;

/**
 * Check the given paths has contain relationship.
 * If the anotherPath contains currPath or the currPath is the subPath of
 * the anotherPath, return 1.
 * If the currPath contains anotherPath or the anotherPath is the subPath of
 * the currPath, return -1.
 * If the currPath and anotherPath has no contain relation, return 0.
 *
 * @inner
 * @param {string} currPath the current path to check
 * @param {string} anotherPath the another path to check
 * @return {number}
 */
function getPathContainRelationship(currPath, anotherPath) {
    let cParts = currPath.split('.');
    let aParts = anotherPath.split('.');

    let cLen = cParts.length;
    let aLen = aParts.length;
    let isCurrLonger = cLen > aLen;
    let len = isCurrLonger ? aLen : cLen;
    for (let i = 0; i < len; i++) {
        let cItem = cParts[i];
        let aItem = aParts[i];

        if (cItem !== aItem) {
            let tmpC = cItem.replace(ARRAY_INDEX_ACCESS_REGEXP, '');
            let isCurrArrAccess = tmpC !== cItem;
            let tmpA = aItem.replace(ARRAY_INDEX_ACCESS_REGEXP, '');
            let isAnotherArrAccess = tmpA !== aItem;

            if (tmpC === tmpA) {
                if (isCurrArrAccess && isAnotherArrAccess) {
                    return 0;
                }

                if (isCurrArrAccess) {
                    return -1;
                }

                return 1;
            }

            return 0;
        }
    }

    return isCurrLonger ? -1 : 1;
}

function filterNoEffectiveSet(target, toAddPath, toAddPathValue, existedPaths) {
    for (let i = existedPaths.length - 1; i >= 0; i--) {
        let item = existedPaths[i];
        if (toAddPath !== item) {
            let result = getPathContainRelationship(toAddPath, item);
            if (result === 1) {
                // if the setting data path is the sub path of the previous data
                // set path, the previous data path need to be deleted, e.g.,
                // the current setting data is {'a': []}, the previous setting
                // data path is {'a[0]': 2}, the previous data path setting will
                // be ignored. As for the a[0] = 2; a = []; with a = []; is equivalent.
                existedPaths.splice(i, 1);
                delete target[item];
            }
            else if (result === -1) {
                // if existed previous data path is the sub path of the setting
                // data path, e.g. the previous set data: {'a': [2]}, current set
                // data: {'a[0]': 2}, will ignore the 'a[0]' data setting. As for
                // the value of the a is reference type，a = []; a.push(2);
                // with a = [2] is equivalent.
                return;
            }
        }
    }

    if (existedPaths.indexOf(toAddPath) === -1) {
        existedPaths.push(toAddPath);
    }

    target[toAddPath] = toAddPathValue;
}

function mergeSetData(target, curr, existedPaths) {
    Object.keys(curr).forEach(k => {
        let value = curr[k];
        if (value === undefined) {
            // undefined is not allowed to set
            value = null;
        }

        filterNoEffectiveSet(target, k, value, existedPaths);
    });
}

/**
 * Get optimized set data paths
 *
 * @param {Array} queues the set data queues to optimize
 * @return {Object}
 */
export function getSetDataPaths(queues) {
    let target = {};
    const existedPaths = [];
    queues.forEach(item => {
        mergeSetData(target, item, existedPaths);
    });
    return target;
}
