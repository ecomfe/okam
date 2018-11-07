/**
 * @file Native swan component transformation plugin.
 *       Fix component triggerEvent API to adapt the okam event handler.
 * @author sparklewhy@gmail.com
 */

'use strict';

const {isVariableDefined, createImportDeclaration} = require('../transform/helper');

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
                if (path.isComponentAdapted) {
                    return;
                }

                let {arguments: args, callee} = path.node;
                const calleeName = callee.name;
                if (!t.isIdentifier(callee) || args.length !== 1) {
                    return;
                }

                if (calleeName === 'Component') {
                    if (isVariableDefined(path, calleeName)) {
                        return;
                    }

                    let rootPath = path.findParent(p => t.isProgram(p));
                    let bodyPath = rootPath.get('body.0');

                    // insert the component fix import statement
                    const fixComponentFuncName = path.scope.generateUid('fixComponent');
                    bodyPath.insertBefore(
                        createImportDeclaration(
                            fixComponentFuncName, COMPONENT_ADAPTER_MODULE_ID, t
                        )
                    );

                    path.replaceWith(t.callExpression(
                        t.identifier(calleeName),
                        [
                            t.callExpression(
                                t.identifier(fixComponentFuncName),
                                args
                            )
                        ]
                    ));

                    // add flag to avoid repeat visiting
                    path.isComponentAdapted = true;
                }
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
