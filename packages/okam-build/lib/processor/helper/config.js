/**
 * @file App/Page/Component config info helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */

const {resolve: resolveDep} = require('../npm');
const {
    string: strUtil
} = require('../../util');
const {toHyphen} = strUtil;

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

const USING_COMPONENT_KEY = 'usingComponents';

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

function formatUsingComponentInfo(components, file, buildManager) {
    if (!components) {
        return;
    }

    let result = {};
    Object.keys(components).forEach(k => {
        let value = components[k];
        let resolvePath = resolveDep(
            buildManager, file, components[k]
        );
        result[toHyphen(k)] = resolvePath || value;
    });

    return result;
}

function normalizeUsingComponentInfo(config, components, file, buildManager) {
    components = formatUsingComponentInfo(
        components, file, buildManager
    );

    let configComponents = formatUsingComponentInfo(
        config[USING_COMPONENT_KEY], file, buildManager
    );

    return Object.assign(components, configComponents);
}

function normalizeUsingComponentConfig(config, components, file, buildManager) {
    if (components) {
        config[USING_COMPONENT_KEY] = normalizeUsingComponentInfo(
            config, components, file, buildManager
        );
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
