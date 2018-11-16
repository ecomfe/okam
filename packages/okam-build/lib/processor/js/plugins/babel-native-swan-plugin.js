/**
 * @file Native swan component transformation plugin.
 *       Fix component triggerEvent API to adapt the okam event handler.
 * @author sparklewhy@gmail.com
 */

'use strict';

const replaceComponentInit = require('../transform/native-component');

/**
 * The component polyfill module id
 *
 * @const
 * @type {string}
 */
const COMPONENT_ADAPTER_MODULE_ID = 'okam-core/src/swan/adapter/component';

module.exports = exports = function ({types: t}) {
    return {
        visitor: {

             /**
             * Replace native component init
             *
             * @param {Object} path ast node path
             * @param {Object} state the processed node state
             */
            CallExpression(path, state) {
                replaceComponentInit(COMPONENT_ADAPTER_MODULE_ID, path, state, t);
            },

            /**
             * Replace `triggerEvent` API with custom `$emit` API
             *
             * @param {Object} path ast node path
             * @param {Object} state the processed node state
             */
            MemberExpression(path, state) {
                let {property} = path.node;
                if (t.isIdentifier(property) && property.name === 'triggerEvent') {
                    property.name = '$emit';
                    return;
                }
            }
        }
    };
};

exports.adapterModuleId = COMPONENT_ADAPTER_MODULE_ID;

exports.isAdapterModule = function (path) {
    return path.indexOf(COMPONENT_ADAPTER_MODULE_ID) !== -1;
};
