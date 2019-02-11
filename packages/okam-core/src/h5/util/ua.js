/**
 * @file The ua utilities
 * @see https://github.com/fex-team/ua-device
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global window:false */

function detectApplePlatform(ua, result) {
    let match;
    if (ua.match('iPhone( Simulator)?;')
        || ua.match('iPad;')
        || ua.match('iPod;')
        || ua.match(/iPhone\s*\d*s?[cp]?;/i)
    ) {
        result.platform = 'ios';
        result.system = 'iOS';
        if (ua.match('iPod;')) {
            result.brand = 'apple';
            result.model = 'iPod Touch';
        }
        else if (ua.match('iPhone;')
            || ua.match(/iPhone\s*\d*s?[cp]?;/i)
        ) {
            result.brand = 'apple';
            result.model = 'iPhone';
        }
        else {
            result.brand = 'apple';
            result.model = 'iPad';
        }

        let systemVersion = '1.0';
        if (match = /OS (.*) like Mac OS X/.exec(ua)) {
            systemVersion = match[1].replace(/_/g, '.');
        }
        result.system += ` ${systemVersion}`;
        return true;
    }

    if (ua.match('Macintosh;')) {
        result.system = 'Mac OS X';
        result.platform = 'mac';

        if (match = /Mac OS X (10[0-9\._]*)/.exec(ua)) {
            result.system += ` ${match[1].replace(/_/g, '.')}`;
        }
        return true;
    }
}

function detectAndroidPlatform(ua, result) {
    if (ua.match('Android')) {
        result.platform = 'android';
        result.system = 'Android';

        let match;
        if (match = /Android(?: )?(?:AllPhone_|CyanogenMod_)?(?:\/)?v?([0-9.]+)/.exec(ua.replace('-update', '.'))) {
            result.system += ` ${match[1]}`;
        }
        return true;
    }
}

const windowsVersionNameMap = {
    '10.0': '10',
    '6.2': '8',
    '6.1': '7',
    '6.0': 'Vista',
    '5.2': 'Server 2003',
    '5.1': 'XP',
    '5.0': '2000'
};

function detectWindowsPlatform(ua, result) {
    if (ua.match('Windows')) {
        let system = 'Windows';
        result.platform = 'windows';

        let match;
        if (match = /Windows NT ([0-9]\.[0-9])/.exec(ua)) {
            let systemVersion = match[1];
            let systemName = systemVersion
                && (windowsVersionNameMap[systemVersion]
                    || 'NT ' + systemVersion);
            systemName && (system += ' ' + systemName);
        }
        result.system = system;

        return true;
    }
}

/**
 * Detect platform info
 *
 * @param {string=} uaStr the user agent string
 * @return {Object}
 */
export function detectPlatform(uaStr) {
    const platformInfo = {
        model: '',
        brand: '',
        system: '',
        platform: ''
    };

    uaStr || (uaStr = window.navigator.userAgent);
    if (typeof uaStr === 'string') {
        let result = detectApplePlatform(uaStr, platformInfo);
        result || (result = detectAndroidPlatform(uaStr, platformInfo));
        result || (result = detectWindowsPlatform(uaStr, platformInfo));
    }

    return platformInfo;
}
