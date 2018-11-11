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
            },

            /**
             * Process `async xxx` expression
             *
             * @param {Object} path the node path
             * @param {Object} state the plugin state
             */
            FunctionExpression(path, state) {
                let node = path.node;
                if (node.async) {
                    importLocalPolyfill(false, path, state, t);
                }
            },

            /**
             * Process `async xxx() {}` object member
             *
             * @param {Object} path the node path
             * @param {Object} state the plugin state
             */
            ObjectMember(path, state) {
                let node = path.node;
                if (node.async) {
                    importLocalPolyfill(false, path, state, t);
                }
            }
        }
    };
};
