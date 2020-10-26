/**
 * @file Catch the unexpected error
 * @see https://developer.mozilla.org/en-US/docs/Web/Events/rejectionhandled
 * @see https://developer.mozilla.org/en-US/docs/Web/Events/unhandledrejection
 * @see https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global window:false */

export default function bindUnCatchException(callback) {
    window.addEventListener('unhandledrejection', callback);
    window.addEventListener('error', callback);
}
