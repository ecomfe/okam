/**
 * @file App/Page/Component config info helper
 * @author sparklewhy@gmail.com
 */

'use strict';

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
    if (Object.keys(usingComponents).length) {
        config.usingComponents = usingComponents;
    }
    // let componentInfo = initComponents(config, components, file, buildManager);
    // componentInfo && Object.assign(config, componentInfo);
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
