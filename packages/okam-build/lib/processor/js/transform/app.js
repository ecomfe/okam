/**
 * @file App entry file transform helper
 * @author sparkelwhy@gmail.com
 */

'use strict';

const {
    createImportDeclaration,
    getFrameworkExtendId,
    createSimpleObjectExpression
} = require('./helper');

/**
 * Create `App.use(xx)` using extension statement
 *
 * @inner
 * @param {Object} t the babel type definition
 * @param {string} calleeName the callee name
 * @param {string} extendName the extension name
 * @param {boolean=} hasPluginOpt whether has extension plugin options
 * @return {Object}
 */
function createFrameworkExtendCallExpression(t, calleeName, extendName, hasPluginOpt) {
    let args = [t.identifier(extendName)];

    if (hasPluginOpt) {
        args.push(t.objectExpression([]));
    }

    return t.expressionStatement(
        t.callExpression(
            t.memberExpression(
                t.identifier(calleeName),
                t.identifier('use')
            ),
            args
        )
    );
}

function registerAppExtendAPI(t, path, bodyPath, baseClassName, apis) {
    if (!apis) {
        return;
    }

    let registerApiConfig = {};
    Object.keys(apis).forEach(apiName => {
        let apiPath = apis[apiName];
        let registerApiName = path.scope.generateUid(apiName);
        bodyPath.insertBefore(
            createImportDeclaration(registerApiName, apiPath, t)
        );
        registerApiConfig[apiName] = t.identifier(registerApiName);
    });

    let apiExpression = createSimpleObjectExpression(registerApiConfig, t);
    let registerApiStatement = t.expressionStatement(
        t.callExpression(
            t.memberExpression(
                t.identifier(baseClassName),
                t.identifier('registerApi')
            ),
            [apiExpression]
        )
    );
    path.insertBefore(registerApiStatement);
}

/**
 * Insert the used extension initialization statements, e.g, watch/data
 *
 * @param {Object} t the babel type definition
 * @param {Object} path the node path
 * @param {Object} bodyPath the code body path
 * @param {string} baseClassName the base class name
 * @param {Object} opts the transformation options
 */
exports.extendAppFramework = function (t, path, bodyPath, baseClassName, opts) {
    // insert the used polyfill import declaration statements
    let polyfill = opts.polyfill || [];
    polyfill.forEach(item => {
        let polyfillId = item.id;
        bodyPath.insertBefore(
            createImportDeclaration(null, polyfillId, t)
        );
    });

    // insert the used extension import declaration statement
    let framework = opts.framework || [];
    let extendList = [];
    framework.forEach(name => {
        let pluginOptCode;
        if (Array.isArray(name)) {
            pluginOptCode = name[1];
            name = name[0];
        }

        let extendRequireId = getFrameworkExtendId(opts.appType, name);
        if (!extendRequireId) {
            return;
        }

        let extendName = path.scope.generateUid(name);
        extendList.push([extendName, pluginOptCode]);
        bodyPath.insertBefore(
            createImportDeclaration(extendName, extendRequireId, t)
        );
    });

    // insert register api statements
    registerAppExtendAPI(t, path, bodyPath, baseClassName, opts.registerApi);

    // insert using the extension statements: `App.use(xx)`
    extendList.forEach(([pluginName, pluginOptCode]) => {
        let result = path.insertBefore(
            createFrameworkExtendCallExpression(
                t, baseClassName, pluginName, pluginOptCode
            )
        );

        if (pluginOptCode) {
            result[0].get('expression.arguments.1').replaceWithSourceString(
                pluginOptCode
            );
        }
    });
};
