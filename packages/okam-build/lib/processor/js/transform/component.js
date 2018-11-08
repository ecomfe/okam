/**
 * @file Component transform helper
 * @author sparklewhy@gmail.com
 */

'use strict';

const {removeNode, removeComments, normalizeInternalBehavior} = require('./helper');

/**
 * Get require expression module id
 *
 * @inner
 * @param {Object} node the require call expression node
 * @param {Object} t the bable type definition
 * @return {?string}
 */
function getRequireExpressionModuleId(node, t) {
    if (t.isCallExpression(node)) {
        let {arguments: args, callee} = node;
        if (t.isIdentifier(callee)
            && callee.name === 'require'
            && args.length === 1
            && t.isLiteral(args[0])
        ) {
            let id = args[0].value;
            return id;
        }
    }
}

/**
 * Remove the binded variable declaration
 *
 * @inner
 * @param {Object} t the babel type definition
 * @param {Object} bindVar the bind variable path information
 * @param {Object} removeOpts the remove options
 */
function removeVariableDeclaration(t, bindVar, removeOpts) {
    let refPaths = bindVar.referencePaths || [];
    let removed;

    // try to remove the bind variable in multiple variable declarations
    refPaths.forEach(item => {
        let parentPath = item.getStatementParent();
        if (t.isVariableDeclaration(parentPath) && t.isIdentifier(item)) {
            removeNode(t, item.parentPath, removeOpts);
            removeComments(t, parentPath, 'leadingComments');
            removed = true;
        }
    });

    // if not multiple variable declarations,
    // remove the single variable declaration statement
    if (!removed) {
        removeNode(t, bindVar.path.getStatementParent(), removeOpts);
    }
}

/**
 * Get the required module path or id information
 *
 * @inner
 * @param {Object} valuePath the used module variable node path
 * @param {string} moduleName the module variable name
 * @param {Object} t the babel type definition
 * @param {boolean=} removeRequireDeclaration whether remove the module require
 *        declaration statement.
 * @return {string}
 */
function getRequiredModulePath(valuePath, moduleName, t, removeRequireDeclaration = false) {
    let bindVar = valuePath.scope.bindings[moduleName];
    if (!bindVar) {
        throw valuePath.buildCodeFrameError(`the variable ${moduleName} import declaration is not found`);
    }

    let declareNodePath = bindVar.path;
    let parentStatmentPath = bindVar.path.getStatementParent();

    // check import statement
    if (t.isImportDeclaration(parentStatmentPath)) {
        let id = parentStatmentPath.node.source.value;
        if (removeRequireDeclaration) {
            let toRemovePath = declareNodePath;
            if (t.isImportDefaultSpecifier(declareNodePath.node)) {
                toRemovePath = declareNodePath.parentPath;
            }
            removeNode(t, toRemovePath, {tail: true});
        }
        return id;
    }
    else if (t.isVariableDeclarator(declareNodePath)) {
        // check require statement
        let initNode = declareNodePath.node.init;
        let id = getRequireExpressionModuleId(initNode, t);
        if (id) {
            removeRequireDeclaration && removeVariableDeclaration(
                t, bindVar, {tail: true}
            );
            return id;
        }
    }

    throw valuePath.buildCodeFrameError(`the variable ${moduleName} import declaration is not found`);
}

/**
 * Get component using component info
 *
 * @param {Object} node the components node
 * @param {Object} path the node path
 * @param {Object} t the babel type definition
 * @return {Object}
 */
exports.getUsedComponentInfo = function (node, path, t) {
    if (!t.isObjectExpression(node)) {
        throw path.buildCodeFrameError('require object');
    }

    let result = {};
    let props = node.properties || [];
    let propPaths = path.get('value.properties');
    let componentPathMap = {};
    for (let i = 0, len = props.length; i < len; i++) {
        let subNode = props[i];

        let key;
        let keyNode = subNode.key;
        if (t.isIdentifier(keyNode)) {
            key = keyNode.name;
        }
        else if (t.isStringLiteral(keyNode)) {
            key = keyNode.value;
        }

        if (!key) {
            throw path.buildCodeFrameError('get key info fail');
        }

        let value = subNode.value;
        if (!t.isIdentifier(value)) {
            throw path.buildCodeFrameError(`${key} require identifier`);
        }

        let componentVarName = value.name;
        let componentPath = componentPathMap[componentVarName];
        if (!componentPath) {
            let valuePath = propPaths[i].get('value');
            componentPath = getRequiredModulePath(valuePath, componentVarName, t, true);
            componentPathMap[componentVarName] = componentPath;
        }
        result[key] = componentPath;
    }

    return result;
};

/**
 * Get component mixin module paths info
 *
 * @param {Object} node the components node
 * @param {Object} path the node path
 * @param {Object} t the babel type definition
 * @param {Object} opts the transformation options
 * @return {Array.<string>}
 */
exports.getUsedMixinModulePaths = function (node, path, t, opts) {
    if (!t.isArrayExpression(node)) {
        throw path.buildCodeFrameError('require array');
    }

    let elements = node.elements || [];
    let elemPaths = path.get('value.elements');
    let mixinModulePaths = [];
    for (let i = 0, len = elements.length; i < len; i++) {
        let item = elements[i];
        let id;
        if (t.isIdentifier(item)) {
            let valuePath = elemPaths[i].get('name');
            id = getRequiredModulePath(valuePath, item.name, t);
        }
        else if (t.isCallExpression(item)) {
            id = getRequireExpressionModuleId(item);
        }

        if (!id) {
            if (t.isStringLiteral(item)) {
                let value = item.value;
                // normalize the internal behavior id
                item.value = normalizeInternalBehavior(opts.appType, value);
            }
            else {
                throw path.buildCodeFrameError('mixins required string literal or using exported mixin module');
            }
        }

        id && mixinModulePaths.push(id);
    }

    return mixinModulePaths;
};

