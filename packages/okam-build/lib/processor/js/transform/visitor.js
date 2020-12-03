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
const {
    getUsedMixinModulePaths,
    getUsedComponentInfo,
    convertDataPropObjectValueToFunction
} = require('./component');
const {
    initH5CreateCallArgs,
    handleH5PageSomeLifeCycle
} = require('./h5/initCallArgs');

/**
 * Traverse the module definition information and extract the `config` information
 * for the app/page/component or mixins/components for page/component.
 *
 * @inner
 * @param {Object} t the babel type definition
 * @param {Object} initConfig the config used to cache the extracted information
 * @param {Object} opts the transformation options
 * @param {Object} pageHookObj config, methods, and other attributes
 * @return {Object}
 */
function getCodeTraverseVisitors(t, initConfig, opts, pageHookObj) {
    let {
        isPage,
        isComponent,
        isBehavior,
        enableMixinSupport,
        filterOptions,
        keepComponentsProp,
        dataPropValueToFunc,
        appType
    } = opts;
    let hasComponents = isPage || isComponent;
    return {
        ObjectProperty(path) {
            let prop = path.node;
            let key = prop.key;
            let keyName = key && key.name;
            if (!isBehavior && keyName === 'config') {
                pageHookObj.config = path.get('value');
                // extract the app/component/page config definition
                let config = getPlainObjectNodeValue(prop.value, path, t);
                initConfig.config = config;
                removeNode(t, path, {tail: true});

                // skip children traverse
                path.skip();
            }
            else if (enableMixinSupport && keyName === 'mixins') {
                // extract the mixins information for page/component
                let mixins = getUsedMixinModulePaths(
                    prop.value, path, t, opts
                );
                initConfig.mixins = mixins;

                path.skip();
            }
            else if (!isBehavior && hasComponents && keyName === 'components') {
                // extract the using components information for page/component
                let config = getUsedComponentInfo(
                    prop.value, path, t, keepComponentsProp
                );
                initConfig.components = config;
                keepComponentsProp || removeNode(t, path, {tail: true});

                path.skip();
            }
            else if (dataPropValueToFunc && !isBehavior && keyName === 'data') {
                convertDataPropObjectValueToFunction(prop, t);
                // skip children traverse
                path.skip();
            }
            else if (filterOptions && !isBehavior && keyName === 'filters') {
                const {getExportFilterNames, generateCode} = require('./filter');
                let filterNames = getExportFilterNames(prop.value, t);

                if (filterOptions.keepFiltersProp) {
                    initConfig.filters = {
                        filterNames
                    };
                }
                else {
                    let code = generateCode(prop.value, t, filterOptions);
                    initConfig.filters = {
                        code,
                        filterNames
                    };
                    removeNode(t, path, {tail: true});
                }

                path.skip();
            }
            else if (keyName === 'methods') {
                pageHookObj.methods = path.get('value').node.properties;
                path.skip();
            }
            else {
                path.skip();
            }
        },
        ObjectMethod(path) {
            if (appType === 'h5' && isPage) {
                handleH5PageSomeLifeCycle(t, path, pageHookObj);
            }
        }
    };
}

/**
 * Create init call arguments
 *
 * @inner
 * @param {Object} declarationPath the declaration statement path to process
 * @param {Object} config the config property value info defined in module
 * @param {Object} opts the transformation options
 * @param {Object} t the babel type definition
 * @return {Array}
 */
function createInitCallArgs(declarationPath, config, opts, t) {
    let {isPage, isComponent, isApp, getInitOptions} = opts;
    let callArgs = [declarationPath.node];
    let initOptions;
    if (opts.tplRefs) {
        initOptions = {refs: opts.tplRefs};
    }

    let extraInitOpts = getInitOptions && getInitOptions(
        config, {isPage, isComponent, isApp}
    );
    if (extraInitOpts) {
        initOptions || (initOptions = {});
        Object.assign(initOptions, extraInitOpts);
    }

    if (initOptions) {
        // insert the `ref` information defined in template to the constructor
        callArgs.push(
            createSimpleObjectExpression(
                initOptions, t
            )
        );
    }

    return callArgs;
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
    // the transformation page hook
    let pageHookObj = {
        pageEvent: {},
        lifeCycle: {}
    };
    if (t.isObjectExpression(declarationPath)) {
        // extract the config information defined in the code
        declarationPath.traverse(
            getCodeTraverseVisitors(
                t, config, opts, pageHookObj
            )
        );
    }
    else if (opts.isExtension) {
        // do not throw exception for not object export extension
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

    if (opts.isApp) {
        // insert the app extension using statements
        appTransformer.extendAppFramework(
            t, path, bodyPath, baseClassName, opts
        );
    }

    let callArgs = createInitCallArgs(declarationPath, config.config, opts, t);

    if (opts.appType === 'h5') {
        // add h5 app router config argument
        let h5InitOpts = {
            routeConfigModId: opts.routeConfigModId,
            path,
            bodyPath
        };
        initH5CreateCallArgs({
            t,
            h5InitOpts,
            pageHookObj,
            callArgs,
            path,
            opts,
            declarationPath
        });
    }

    let needExport = opts.needExport || !opts.baseClass;
    let toReplacePath = needExport
        ? path.get('declaration')
        : path;
    // wrap the export module using the base name
    let callExpression = t.callExpression(
        t.identifier(baseClassName),
        callArgs
    );

    if (opts.isBehavior || !opts.baseClass) {
        toReplacePath.replaceWith(t.expressionStatement(
            callExpression
        ));
    }
    else {
        toReplacePath.replaceWith(
            t.expressionStatement(
                t.callExpression(
                    t.identifier(opts.baseClass),
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
    transformOpts.baseId = options.extensionName
        ? getFrameworkExtendId(transformOpts.appType, options.extensionName, true)
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
 * @param {boolean=} options.isExtension whether is the extension transform, e.g., Behavior
 * @param {string=} options.extensionName the extension name
 * @param {boolean=} options.needExport whether need to export the module definition
 * @param {boolean=} options.noBaseClass whether has none base class to wrap the
 *        App/Page/Component definition, optional, by default false
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
