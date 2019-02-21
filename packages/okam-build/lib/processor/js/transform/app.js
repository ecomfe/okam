/**
 * @file App entry file transform helper
 * @author sparkelwhy@gmail.com
 */

'use strict';

const {isPlainObject} = require('../../../util').lang;
const {
    createImportDeclaration,
    getFrameworkExtendId
} = require('./helper');

function createAPIRegisterArg(apiConf, t) {
    let props = [];
    Object.keys(apiConf).forEach(k => {
        let {name, moduleName, spread} = apiConf[k];
        let node;
        if (spread) {
            node = t.spreadElement(moduleName);
        }
        else {
            node = t.objectProperty(
                t.identifier(`'${name}'`),
                moduleName
            );
        }
        props.push(node);
    });

    return props.length ? t.objectExpression(props) : null;
}

function createRegisterAPIStatement(t, appClassName, apiArg, override) {
    let args = [apiArg];
    override && args.push(t.booleanLiteral(true));
    let stmt = t.expressionStatement(
        t.callExpression(
            t.memberExpression(
                t.identifier(appClassName),
                t.identifier('registerApi')
            ),
            args
        )
    );

    return stmt;
}

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
    let overrideApis = [];
    Object.keys(apis).forEach(apiName => {
        let apiPath = apis[apiName];
        let spread = false;
        let override = false;
        if (isPlainObject(apiPath)) {
            spread = apiPath.spread;
            override = apiPath.override;
            apiPath = apiPath.modId;
        }

        if (typeof apiPath !== 'string') {
            throw new Error(`api build config ${apiName} missing modId`);
        }

        let registerApiName = path.scope.generateUid(apiName);
        bodyPath.insertBefore(
            createImportDeclaration(registerApiName, apiPath, t)
        );

        let conf = {
            name: apiName,
            moduleName: t.identifier(registerApiName),
            spread
        };
        if (override) {
            overrideApis.push(conf.moduleName);
        }
        else {
            registerApiConfig[apiName] = conf;
        }
    });

    overrideApis.forEach(item => {
        let registerApiStatement = createRegisterAPIStatement(
            t, baseClassName, item, true
        );
        path.insertBefore(registerApiStatement);
    });

    let apiArg = createAPIRegisterArg(registerApiConfig, t);
    if (apiArg) {
        let registerApiStatement = createRegisterAPIStatement(
            t, baseClassName, apiArg
        );
        path.insertBefore(registerApiStatement);
    }
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

    // insert the used extension import declaration statements
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
