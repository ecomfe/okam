/**
 * @file Bind current app/page visibility change listener
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global document:false */

// init hidden state attribute and visibilityChange event name
let hidden;
let visibilityChange;
if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
}
else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
}
else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
}

/**
 * Bind page visibility change listener
 *
 * @param {Function} callback the listener callback when page visibility change
 * @return {Function} the listener remove api
 */
export default function bindVisibilityChange(callback) {
    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === 'undefined' || hidden === undefined) {
        console.log('Current browser does not support the Page Visibility API.');
    }
    else {
        // add page visibility change listener
        let listener = () => callback(document[hidden]);
        document.addEventListener(visibilityChange, listener, false);

        return () => {
            document.removeEventListener(visibilityChange, listener, false);
        };
    }
}
