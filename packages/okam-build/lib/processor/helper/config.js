/**
 * @file App/Page/Component config info helper
 * @author sparklewhy@gmail.com
 */

'use strict';

const {toHyphen} = require('../../util').string;

/**
 * The abbreviation of the page config item
 *
 * @const
 * @type {Object}
 */
const PAGE_CONFIG_ABBR = {
    title: 'navigationBarTitleText',
    opacity: 'enableOpacityNavigationBar'
};

function normalizeConfig(abbrConfItems, config) {
    let result = {};
    Object.keys(config).forEach(k => {
        let fullConfig = abbrConfItems[k];
        if (fullConfig) {
            result[fullConfig] = config[k];
        }
        else {
            result[k] = config[k];
        }
    });
    return result;
}

function normalizeUsingComponentConfig(config, components, file, buildManager) {
    let usingComponents = Object.assign({}, components, config.usingComponents);
    let {injectComponents} = file;
    if (injectComponents) {
        let existed = {};
        Object.keys(usingComponents).forEach(k => {
            existed[toHyphen(k)] = true;
        });

        // inject the global component declaration
        // the inner component declaration has higher priority than the global
        Object.keys(injectComponents).forEach(k => {
            if (!existed[k]) {
                usingComponents[k] = injectComponents[k];
            }
        });
    }

    if (Object.keys(usingComponents).length) {
        config.usingComponents = usingComponents;
    }
    return config;
}

exports.normalPageConfig = function (config, components, file, buildManager) {
    config = normalizeConfig(PAGE_CONFIG_ABBR, config);
    return normalizeUsingComponentConfig(
        config, components, file, buildManager
    );
};

exports.normalizeComponentConfig = function (config, components, file, buildManager) {
    return normalizeUsingComponentConfig(
        config, components, file, buildManager
    );
};
