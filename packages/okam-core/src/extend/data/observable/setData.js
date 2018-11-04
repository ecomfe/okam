/**
 * @file Optimize set data queues
 * @author sparklewhy@gmail.com
 */

'use strict';

const ARRAY_INDEX_ACCESS_REGEXP = /\[\d+\]$/;

function isSubPath(currPath, toAddPath) {
    let cParts = currPath.split('.');
    let aParts = toAddPath.split('.');

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
            let isAddArrAccess = tmpA !== aItem;

            if (tmpC === tmpA) {
                if (isCurrArrAccess && isAddArrAccess) {
                    return false;
                }
                else if (isCurrArrAccess) {
                    return false;
                }

                return true;
            }
            else {
                return false;
            }
        }
    }

    return isCurrLonger ? false : true;
}

function filterNonEffectiveSet(target, toAddPath, existedPaths) {
    for (let i = existedPaths.length - 1; i >= 0; i--) {
        let item = existedPaths[i];
        if (toAddPath !== item && isSubPath(toAddPath, item)) {
            existedPaths.splice(i, 1);
            delete target[item];
        }
    }
}

function mergeSetData(target, curr, existedPaths) {
    Object.keys(curr).forEach(k => {
        let value = curr[k];
        if (value === undefined) {
            // undefined is not allowed to set
            value = null;
        }

        filterNonEffectiveSet(target, k, existedPaths);

        if (existedPaths.indexOf(k) === -1) {
            existedPaths.push(k);
        }

        target[k] = value;
    });
}

export function getSetDataPaths(queues) {
    let target = {};
    const existedPaths = [];
    queues.forEach(item => {
        mergeSetData(target, item, existedPaths);
    });
    return target;
}
