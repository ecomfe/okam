/**
 * @file Native component transform helper
 * @author sparklewhy@gmail.com
 */

'use strict';


const {isVariableDefined, createImportDeclaration} = require('./helper');

 /**
  * Replace native component init
  *
  * @param {string} adapterModuleId the component module id to adapt to the okam
  * @param {Object} path ast node path
  * @param {Object} state the processed node state
  * @param {Object} t the babel AST node type definition
  */
module.exports = function (adapterModuleId, path, state, t) {
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
                fixComponentFuncName, adapterModuleId, t
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
};
