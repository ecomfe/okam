/**
 * @file Mini program transform visitor
 * @author sparklewhy@gmail.com
 */

'use strict';

const {
    createSimpleObjectExpression,
    createImportDeclaration,
    getPlainObjectNodeValue,
    getBaseId,
    getFrameworkExtendId,
    removeNode,
    removeComments
} = require('./helper');
const appTransformer = require('./app');
const componentTransformer = require('./component');

/**
 * Traverse the module definition information and extract the `config` information
 * for the app/page/component or mixins/components for page/component.
 *
 * @inner
 * @param {Object} t the babel type definition
 * @param {Object} initConfig the config used to cache the extracted information
 * @param {Object} opts the transformation options
 * @return {Object}
 */
function getCodeTraverseVisitors(t, initConfig, opts) {
    let {isPage, isComponent, isBehavior} = opts;
    let hasComponents = isPage || isComponent;
    return {
        ObjectProperty(path) {
            let prop = path.node;
            let key = prop.key;
            let keyName = key && key.name;
            if (!isBehavior && keyName === 'config') {
                // extract the app/component/page config defition
                let config = getPlainObjectNodeValue(prop.value, path, t);
                initConfig.config = config;
                removeNode(t, path, {tail: true});
            }
            else if (keyName === 'mixins') {
                // extract the mixins information for page/component
                let mixins = componentTransformer.getUsedMixinModulePaths(
                    prop.value, path, t, opts
                );
                initConfig.mixins = mixins;
            }
            else if (!isBehavior && hasComponents && keyName === 'components') {
                // extract the using components information for page/compnoent
                let config = componentTransformer.getUsedComponentInfo(
                    prop.value, path, t
                );
                initConfig.components = config;
                removeNode(t, path, {tail: true});
            }
        }
    };
}

/**
 * Transform mini program code
 *
 * @inner
 * @param {Object} t the babel type definition
 * @param {Object} path the node path to transform
 * @param {Object} declarationPath the declaration statement path to process
 * @param {Object} config the config used to cache the config information
 *        defined in the code
 * @param {Object} opts the transformation options
 */
function transformMiniProgram(t, path, declarationPath, config, opts) {
    if (t.isObjectExpression(declarationPath)) {
        // extract the config information defined in the code
        declarationPath.traverse(
            getCodeTraverseVisitors(t, config, opts)
        );
    }
    else if (opts.isExtend) {
        return;
    }
    else {
        throw path.buildCodeFrameError('export require plain object');
    }

    let baseClassName = path.scope.generateUid(opts.baseName);
    let rootPath = path.findParent(p => t.isProgram(p));
    let bodyPath = rootPath.get('body.0');

    // ensure the inserted import declaration is after the leading comment
    removeComments(t, bodyPath, 'leadingComments');

    // insert the base name import statement
    bodyPath.insertBefore(
        createImportDeclaration(baseClassName, opts.baseId, t)
    );

    let isApp = opts.isApp;
    let callArgs = [declarationPath.node];
    if (isApp) {
        // insert the app extension use statements
        appTransformer.extendAppFramework(t, path, bodyPath, baseClassName, opts);
    }
    else if (opts.tplRefs) {
        // insert the `ref` information defined in template to the constructor
        callArgs.push(
            createSimpleObjectExpression(
                opts.tplRefs, t
            )
        );
    }

    let toReplacePath = opts.needExport
        ? path.get('declaration')
        : path;
    // wrap the export module using the base name
    let callExpression = t.callExpression(
        t.identifier(baseClassName),
        callArgs
    );
    if (opts.isBehavior) {
        toReplacePath.replaceWith(t.expressionStatement(
            callExpression
        ));
    }
    else {
        toReplacePath.replaceWith(
            t.expressionStatement(
                t.callExpression(
                    t.identifier(opts.baseName),
                    [
                        callExpression
                    ]
                )
            )
        );
    }

    // stop traverse to avoid the new created export default statement above
    // that be revisited in this plugin `ExportDefaultDeclaration` visitor
    // path.stop();
}

/**
 * Get transform options
 *
 * @inner
 * @param {Object} options the transformation type options
 * @param {Object} state the transformation plugin state
 * @return {Object}
 */
function getTransformOptions(options, state) {
    let transformOpts = Object.assign({}, options, state.opts);
    transformOpts.baseId = options.extend
        ? getFrameworkExtendId(transformOpts.appType, options.extend, true)
        : getBaseId(transformOpts.appType, transformOpts.baseName);
    return transformOpts;
}

/**
 * Get mini program script transform visitor
 *
 * @param {Object} options the options to create visitor
 * @param {string} options.baseName the base name to create the App/Component etc.
 * @param {boolean=} options.isApp whether is the app transformation
 * @param {boolean=} options.isPage whether is the page transformation
 * @param {boolean=} options.isComponent whether is the component transformation
 * @param {boolean=} options.isBehavior whether is the behavior transformation
 * @param {boolean=} options.isExtend whether is the extension transform, e.g., Behavior
 * @param {string=} options.extend the extension name
 * @param {boolean=} options.needExport whether need to export the module definition
 * @return {Function}
 */
function getMiniProgramVisitor(options) {
    return function ({types: t}) {
        return {
            visitor: {

                /**
                 * Process `export default {}` statement
                 *
                 * @param {Object} path the node path
                 * @param {Object} state the plugin state
                 */
                ExportDefaultDeclaration(path, state) {
                    let transformOpts = getTransformOptions(options, state);

                    let config = {};
                    transformMiniProgram(
                        t, path, path.get('declaration'), config, transformOpts
                    );
                    transformOpts.config && (transformOpts.config(config));
                },

                /**
                 * Process `module.exports = {}` statement
                 *
                 * @param {Object} path the node path
                 * @param {Object} state the plugin state
                 */
                AssignmentExpression(path, state) {
                    let transformOpts = getTransformOptions(options, state);

                    let node = path.node;
                    let left = node.left;
                    if (t.isMemberExpression(left)) {
                        let obj = left.object.name;
                        let prop = left.property.name;

                        if (obj === 'module' && prop === 'exports') {
                            let config = {};
                            transformMiniProgram(
                                t, path, path.get('right'), config, transformOpts
                            );
                            transformOpts.config && (transformOpts.config(config));
                        }
                    }
                }
            }
        };
    };
}

module.exports = exports = getMiniProgramVisitor;
