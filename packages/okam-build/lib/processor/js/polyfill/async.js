/**
 * @file Add async await polyfill local declaration
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const {importLocalPolyfill} = require('./helper');

module.exports = function ({types: t}) {
    return {
        visitor: {

            /**
             * Process `await xxx` expression
             *
             * @param {Object} path the node path
             * @param {Object} state the plugin state
             */
            AwaitExpression(path, state) {
                importLocalPolyfill(false, path, state, t);
            }
        }
    };
};
