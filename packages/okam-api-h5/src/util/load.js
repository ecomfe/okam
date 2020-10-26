/**
 * @file Load script util
 * @author congpeisen@baidu.com
 */

'use strict';

/* global document */

/**
 * Load asynchronous script
 *
 * @param {string} url scirpt url
 * @return {Object} load promise
 */
export function loadScript(url) {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.type = 'text/javascript';

        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    resolve();
                }
            };
        }
        else {
            script.onload = function () {
                resolve();
            };
        }

        script.onerror = function (e) {
            reject(e);
        };

        script.src = url;
        document.body.appendChild(script);
    });
}
