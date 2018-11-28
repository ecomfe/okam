/**
 * @file Prepare the app env
 * @author sparklewhy@gmail.com
 */

'use strict';

const allAppEnvs = {
    wx: 'wx',
    swan: 'swan',
    tt: 'tt',
    ant: 'my'
};

function fakeAppEnvAPIs(envKey) {
    global[envKey] = {
        getSystemInfo() {},
        request() {},
        createSelectorQuery() {
            return {
                select(path) {
                    return path;
                },
                selectAll(path) {
                    return [path];
                }
            };
        }
    };

    global.getApp = function () {
        return {
            hi: 22
        };
    };

    global.getCurrentPages = function () {
        return [];
    };
}

Object.keys(allAppEnvs).forEach(k => fakeAppEnvAPIs(allAppEnvs[k]));

export default function reset(appType) {
    fakeAppEnvAPIs(allAppEnvs[appType]);
}
