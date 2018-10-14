/**
 * @file The observer Helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * Add data access path to the data selector
 *
 * @param {?string} selector current data access selector
 * @param {string} path the access path to append
 * @return {string}
 */
export function addSelectorPath(selector, path) {
    if (selector == null) {
        return path;
    }

    if (typeof path === 'number') {
        selector += `[${path}]`;
    }
    else {
        selector += `.${path}`;
    }
    return selector;
}

/**
 * Convert the data access paths to the data selector.
 * e.g., ['obj', 'arr', 0, 'title'] => 'obj.arr[0].title'
 *
 * @param {Array} paths the data access paths
 * @return {?string}
 */
export function getDataSelector(paths) {
    let path = null;
    paths.forEach(p => (path = addSelectorPath(path, p)));
    return path;
}

/**
 * Remove the array index accessor.
 * E.g., ['a', 2, 'b', 0] => ['a']
 *       ['a', 'b', 0] => ['a', 'b']
 * If the `requiredMinLen` is 2,
 * then ['a', 2, 'b', 0] => ['a', 2]
 *      ['a', 'b', 'c', 0] => ['a', 'b', 'c']
 *
 * @inner
 * @param {Array.<string|number>} paths the data access paths
 * @param {number=} requiredMinLen the minimum length of the processed paths after
 *        array index accessor removed, by default no limit.
 * @return {Array}
 */
function removeArrayIndexAccessPath(paths, requiredMinLen) {
    let result = [];

    // using 0 stand for no limit for the processed paths length
    requiredMinLen || (requiredMinLen = 0);
    let currNum = 0;
    for (let i = 0, len = paths.length; i < len; i++) {
        let item = paths[i];
        if (typeof item === 'number' && currNum >= requiredMinLen) {
            break;
        }
        result.push(item);
        currNum++;
    }
    return result;
}

/**
 * Add depPaths to depList
 *
 * @param {Array} depList the target dependence list to collect
 * @param {Array} depPaths the dep data accessed path info
 * @return {Array}
 */
export function addDep(depList, depPaths) {
    // remove the array index visited path
    // e.g., the data c dependence on `arr[0].arr2[0]` and `obj.c.arr[0]`,
    // after removing array index accessed paths,
    // the data c dependence on `arr` and `obj.c.arr`
    let depItem = removeArrayIndexAccessPath(depPaths);

    let depLen = depItem.length;
    for (let j = depList.length - 1; j >= 0; j--) {

        // check whether existed sub dependence data path
        // e.g., the data c dependence on `a.b` and `a.b.c`,
        // then existed sub dependence data path: `a.b` will be ignored,
        // the data c only save `a.b.c` dependence data path information.
        let item = depList[j];
        let itemLen = item.length;
        let isItemLonger = itemLen >= depLen;
        let limit = isItemLonger ? depLen : itemLen;
        let match = true;
        for (let k = 0; k < limit; k++) {
            if (depItem[k] !== item[k]) {
                match = false;
                break;
            }
        }

        if (match) {
            if (isItemLonger) {
                return depList;
            }
            // replace the shorter sub data path with the longer data path
            depList.splice(j, 1, depItem);
            return depList;
        }
    }

    depList.push(depItem);
    return depList;
}

/**
 * Check the given watch path is changed
 *
 * @param {Array} changePath the change data path
 * @param {Array} watchPath the watch data path
 * @param {Object=} options watch options
 * @param {boolean=} options.deep whether deep watch, by default false
 * @return {boolean}
 */
export function isWatchChange(changePath, watchPath, options) {
    // by default array is deep watch
    changePath = removeArrayIndexAccessPath(changePath, watchPath.length);

    let changePathLen = changePath.length;
    let watchPathLen = watchPath.length;
    let isChangePathLonger = changePathLen > watchPathLen;
    let limitLen = isChangePathLonger ? watchPathLen : changePathLen;
    let idx = 0;
    for (; idx < limitLen; idx++) {
        if (changePath[idx] !== watchPath[idx]) {
            return false;
        }
    }

    if (isChangePathLonger && (!options || !options.deep)) {
        return false;
    }

    return true;
}
