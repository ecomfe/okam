/**
 * @file The app/page/component config json processor
 * @author sparklewhy@gmail.com
 */

'use strict';

const OKAM_ENV_KEY_REGEXP = /^_\w+Env$/;

function filterNullPropertyConfig(conf) {
    let result = {};
    Object.keys(conf).forEach(k => {
        if (conf[k] != null) {
            result[k] = conf[k];
        }
    });

    return result;
}

/**
 * Compile config json: remove not current app type config info
 * merge the common config with the specified app config.
 *
 * @param {Object} file the file to process
 * @param {Object} options the compile options
 * @return {{content: string}}
 */
function compile(file, options) {
    let {envConfigKey} = options;
    let obj = JSON.parse(file.content.toString());
    let result = {};
    Object.keys(obj).forEach(k => {
        if (!OKAM_ENV_KEY_REGEXP.test(k)) {
            result[k] = obj[k];
        }
    });

    let appSpecConf = obj[envConfigKey];
    let isAppConfig = file.isAppConfig;
    appSpecConf && Object.keys(appSpecConf).forEach(k => {
        let value = appSpecConf[k];
        if (value == null) {
            // remove null property
            if (result.hasOwnProperty(k)) {
                delete result[k];
            }
        }
        else if (isAppConfig && k === 'window') {
            let windowConf = Object.assign({}, result[k], value);
            result[k] = filterNullPropertyConfig(windowConf);
        }
        else {
            result[k] = value;
        }
    });

    return {
        content: JSON.stringify(result, null, 4)
    };
}

module.exports = exports = compile;

