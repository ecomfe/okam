/**
 * @file OKAM global components
 * @author sparklewhy@gmail.com
 */

'use strict';

const pathUtil = require('path');
const {toHyphen} = require('../util').string;

/**
 * Initialize the imported global component definition
 *
 * @param {Object} componentConf the component config
 * @param {string} sourceRoot the source root directory
 * @return {Object}
 */
function initGlobalComponents(componentConf, sourceRoot) {
    let {global: globalComponents} = componentConf;
    if (!globalComponents) {
        return;
    }

    let result = {};
    Object.keys(globalComponents).forEach(k => {
        let value = globalComponents[k];
        let isRelMod = value.charAt(0) === '.';
        if (isRelMod) {
            value = pathUtil.join(sourceRoot, value);
        }
        result[toHyphen(k)] = {
            isNpmMod: !isRelMod,
            modPath: value
        };
    });
    return result;
}

module.exports = initGlobalComponents;
