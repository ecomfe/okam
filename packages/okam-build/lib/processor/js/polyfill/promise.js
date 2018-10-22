/**
 * @file Add promise polyfill local declaration
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const {importLocalPolyfill} = require('./helper');

module.exports = function ({types: t}) {
    return {
        visitor: {

            /**
             * Process `Promise.xx` member visit expression
             *
             * @param {Object} path the node path
             * @param {Object} state the plugin state
             */
            MemberExpression(path, state) {
                let name = path.node.object.name;
                importLocalPolyfill(name, path, state, t);
            },

            /**
             * Process `new Promise()` new expression
             *
             * @param {Object} path the node path
             * @param {Object} state the plugin state
             */
            NewExpression(path, state) {
                let name = path.node.callee.name;
                importLocalPolyfill(name, path, state, t);
            }
        }
    };
};
