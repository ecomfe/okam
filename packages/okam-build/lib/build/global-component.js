/**
 * @file OKAM global components
 * @author sparklewhy@gmail.com
 */

'use strict';

const pathUtil = require('path');
const {toHyphen} = require('../util').string;

const BUILTIN_COMPONENTS_PACKAGE_ROOT = 'okam-component/src/';

/**
 * Initialize the imported global component definition
 *
 * @param {string} appType the app type to build
 * @param {Object} componentConf the component config
 * @param {string} sourceDir the source root directory
 * @return {Object}
 */
function initGlobalComponents(appType, componentConf, sourceDir) {
    let {global: globalComponents} = componentConf;
    if (!globalComponents) {
        return;
    }

    let result = {};
    Object.keys(globalComponents).forEach(k => {
        let value = globalComponents[k];
        value = value.replace(/^okam\//, BUILTIN_COMPONENTS_PACKAGE_ROOT + appType + '/');
        let isRelMod = value.charAt(0) === '.';
        if (isRelMod) {
            value = pathUtil.join(sourceDir, value);
        }
        result[toHyphen(k)] = {
            isNpmMod: !isRelMod,
            modPath: value
        };
    });
    return result;
}

module.exports = initGlobalComponents;
