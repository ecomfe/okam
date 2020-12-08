/**
 * @file init App or Page create call args in the visitor
 * @author liujiaor@gmail.com
 */
const {
    createImportDeclaration,
    removeNode
} = require('../helper');

const pageLifeCycleMap = {
    onInit: {
        // Life cycle after transformation
        transLifeCycle: 'created',
        // compiled location: insert before or after the life cycle of the transformation
        insert: 'before'
    },
    onLoad: 'created',
    onUnload: 'destroyed',
    onShow: 'activated',
    onHide: 'deactivated'
};
let trarsPageLifeCycleFlag = false;

/**
 * temporary storage page some life cycle to pageHookObj, such as onReachBottom, onPageScroll, oninit, onload
 *
 * @inner
 * @param {Object} t the babel type definition
 * @param {Object} path the node path to transform
 * @param {?Object} pageHookObj the transformation pageHook
 */
exports.handleH5PageSomeLifeCycle = function (t, path, pageHookObj) {
    const pageEventList = [
        'onPullDownRefresh',
        'onReachBottom',
        'onPageScroll',
        'onTabItemTap',
        'onShareAppMessage',
        'onURLQueryChange'
    ];

    let prop = path.node;
    let key = prop.key;
    let keyName = key && key.name;

    if (pageEventList.indexOf(keyName) !== -1) {
        pageHookObj.pageEvent[keyName] = path.node;
        removeNode(t, path);
        path.skip();
    }
    else if (Object.keys(pageLifeCycleMap).indexOf(keyName) !== -1) {
        pageHookObj.lifeCycle[keyName] = path.node;
        trarsPageLifeCycleFlag = true;
        removeNode(t, path);
        path.skip();
    }
    else if (Object.values(pageLifeCycleMap).indexOf(keyName) !== -1) {
        pageHookObj.lifeCycle[keyName] = path.node;
        removeNode(t, path);
        path.skip();
    }
    else {
        path.skip();
    }
};

/**
 * Extract page Api to methods at h5, such as onReachBottom, onPageScroll
 *
 * @inner
 * @param {Object} t the babel type definition
 * @param {Object} path the node path to transform
 * @param {Object} opts the transformation options
 * @param {?Object} pageHookObj the transformation pageHook
 */
function extractPageApi(t, path, opts, pageHookObj) {
    const transPageEventList = pageHookObj.pageEvent;
    if (Object.keys(transPageEventList).length === 0) {
        return;
    }
    const methodsArray = pageHookObj.methods || [];
    for (let key of Object.keys(transPageEventList)) {
        const extractPageEvent = transPageEventList[key];
        const apiBody = extractPageEvent.body;
        const apiParams = extractPageEvent.params;
        const methodObj = t.objectMethod(
            'method',
            t.identifier(key),
            apiParams,
            apiBody
        );
        methodsArray.push(methodObj);
    }
    t.objectProperty(
        t.identifier('methods'),
        t.objectExpression(methodsArray)
    );
}

/**
 * Extract onInit/onLoad lifecycle to created at h5
 *
 * @inner
 * @param {Object} t the babel type definition
 * @param {Object} path the node path to transform
 * @param {Object} opts the transformation options
 * @param {?Object} pageHookObj the transformation pageHook
 * @param {Object} declarationPath the declaration statement path to process
 */
function extractLifeCycleHook(t, path, opts, pageHookObj, declarationPath) {
    const lifeCycleList = pageHookObj.lifeCycle;
    if (Object.keys(lifeCycleList).length === 0) {
        return;
    }

    if (!trarsPageLifeCycleFlag) {
        return;
    }

    // Considering the problem of mapping multiple, do temporary storage
    let targetPageHookTempList = {};
    Object.keys(pageLifeCycleMap).forEach(transItem => {
        const transPageHookNode = lifeCycleList[transItem];
        const targetPageHook = pageLifeCycleMap[transItem];

        let insertLoc;
        let targetLifeCycle;
        if (typeof targetPageHook === 'object') {
            // Insert location
            insertLoc = targetPageHook.insert;
            // transform lifeCycle
            targetLifeCycle = targetPageHook.transLifeCycle;
        }
        else {
            targetLifeCycle = targetPageHook;
        }

        const targetPageHookNode = lifeCycleList[targetLifeCycle];
        targetPageHookTempList[targetLifeCycle] = targetPageHookTempList[targetLifeCycle] || {};
        targetPageHookTempList[targetLifeCycle].node = targetPageHookTempList[targetLifeCycle].node || [];
        targetPageHookTempList[targetLifeCycle].params = targetPageHookTempList[targetLifeCycle].params || [];
        targetPageHookTempList[targetLifeCycle].generator = targetPageHookNode && targetPageHookNode.generator || false;
        targetPageHookTempList[targetLifeCycle].async = targetPageHookNode && targetPageHookNode.async || false;

        if (targetPageHookNode && targetPageHookNode.body && !targetPageHookTempList[targetLifeCycle].node.length) {
            const targetBody = targetPageHookNode.body.body;
            const tempNode = targetPageHookTempList[targetLifeCycle].node;
            targetPageHookTempList[targetLifeCycle].node = tempNode.concat(targetBody);
            targetPageHookTempList[targetLifeCycle].params = targetPageHookNode.params;
        }

        if (transPageHookNode) {
            const paramName = transPageHookNode.params[0] && transPageHookNode.params[0].name || 'option';
            // 匿名函数
            const anonymousFuncExpression = t.expressionStatement(
                t.callExpression(
                    t.memberExpression(
                        t.functionExpression(
                            null,
                            [t.identifier(paramName)],
                            t.blockStatement(transPageHookNode.body.body),
                            transPageHookNode.generator,
                            transPageHookNode.async
                        ),
                        t.identifier('call')
                    ),
                    [t.identifier('this'), t.identifier('this.$route.query')]
                )
            );
            if (insertLoc === 'before') {
                targetPageHookTempList[targetLifeCycle].node.unshift(anonymousFuncExpression);
            }
            else {
                targetPageHookTempList[targetLifeCycle].node.push(anonymousFuncExpression);
            }
        }
    });
    Object.keys(targetPageHookTempList).forEach(targetItem => {
        const targetNode = targetPageHookTempList[targetItem].node;
        const targetParams = targetPageHookTempList[targetItem].params;
        const targetAsync = targetPageHookTempList[targetItem].async;
        const targetHookName = targetAsync ? 'async' + ' ' + targetItem : targetItem;
        if (targetNode.length) {
            declarationPath.node.properties.push(t.objectMethod(
                'method',
                t.identifier(targetHookName),
                targetParams,
                t.blockStatement(targetNode)
            ));
        }
    });

}


/**
 * Get TabBar && networktime config visitor
 *
 * @inner
 * @param {Object} t the babel type definition
 * @param {string} appConfigNodes app config nodes
 * @param {Function} callback the callback to be executed when tabBar && networkTimeout config definition found
 * @return {Object}
 */
function getSomeConfigVisitor(t, appConfigNodes) {
    return {
        ObjectProperty: {
            enter(path) {
                let prop = path.node;
                let key = prop.key;
                let keyName = key && key.name;
                if (keyName === 'tabBar') {
                    appConfigNodes.tabBar = prop.value;
                }
                else if (keyName === 'window') {
                    appConfigNodes.window = prop.value;
                }
                else if (keyName === 'networkTimeout' && prop.value.type === 'ObjectExpression') {
                    appConfigNodes.networkTimeout = prop.value;
                }
                else if (keyName === 'iconPath' || keyName === 'selectedIconPath') {
                    let iconPath = prop.value;
                    if (t.isStringLiteral(iconPath)) {
                        iconPath = iconPath.value;

                        if (iconPath.charAt(0) !== '.') {
                            iconPath = `./${iconPath}`;
                        }
                        path.get('value').replaceWith(
                            t.callExpression(
                                t.identifier('require'),
                                [t.stringLiteral(iconPath)]
                            )
                        );
                    }
                }
            }
        }
    };
}

/**
 * Init h5 app create call args
 *
 * @inner
 * @param {Object} t the babel type definition
 * @param {Object} opts the transformation options
 * @param {?Object} pageHookObj config, methods, and other attributes
 * @param {Array} callArgs the app creator call args to init
 */
function initH5AppCreateCallArgs(t, opts, pageHookObj, callArgs) {

    let {routeConfigModId, path, bodyPath} = opts;
    if (!routeConfigModId) {
        return;
    }

    let appConfigNodes = {};
    const configPath = pageHookObj.config;
    if (configPath) {
        configPath.traverse(
            getSomeConfigVisitor(t, appConfigNodes)
        );
    }

    // todo navigate看下是否需要做成可配置
    const navigateBarClassName = path.scope.generateUid('NavigateBar');
    bodyPath.insertBefore(
        createImportDeclaration(navigateBarClassName, 'okam-component-h5/src/NavigateBar', t)
    );

    const pullDownRefreshClassName = path.scope.generateUid('PullUpRefresh');
    bodyPath.insertBefore(
        createImportDeclaration(pullDownRefreshClassName, 'okam-component-h5/src/PullUpRefresh', t)
    );

    let appLayoutCreatorList = [
        t.objectProperty(t.identifier('navigateBarCreator'), t.identifier(navigateBarClassName)),
        t.objectProperty(t.identifier('pullUpRefreshCreator'), t.identifier(pullDownRefreshClassName))
    ];

    const {
        tabBar: tabBarConfigNode,
        networkTimeout: netWorkTimeNode,
        window: windowNode
    } = appConfigNodes;

    let routerExpression = t.memberExpression(
        t.callExpression(
            t.identifier('require'),
            [t.stringLiteral(routeConfigModId)]
        ),
        t.identifier('default')
    );

    let tabBarProp;
    if (tabBarConfigNode) {
        let tabBarClassName = path.scope.generateUid('TabBar');
        bodyPath.insertBefore(
            createImportDeclaration(tabBarClassName, 'okam-component-h5/src/TabBar', t)
        );

        const tabBarCreator = t.objectProperty(t.identifier('tabBarCreator'), t.identifier(tabBarClassName));
        appLayoutCreatorList.push(tabBarCreator);
        tabBarProp = t.objectProperty(
            t.identifier('tabBar'),
            t.objectExpression([
                t.objectProperty(t.identifier('creator'), t.identifier(tabBarClassName)),
                t.objectProperty(t.identifier('props'), tabBarConfigNode)
            ])
        );
    }

    const appLayoutProp = t.objectProperty(
        t.identifier('appLayout'),
        t.objectExpression(appLayoutCreatorList)
    );

    let netWorkTimeProp;
    if (netWorkTimeNode) {
        netWorkTimeProp = t.objectProperty(
            t.identifier('networkTimeout'),
            netWorkTimeNode
        );
    }

    let windowProp;
    if (windowNode) {
        windowProp = t.objectProperty(
            t.identifier('window'),
            windowNode
        );
    }

    let objExpressionArgs = [
        t.objectProperty(t.identifier('routes'), routerExpression)
    ];
    tabBarProp && objExpressionArgs.push(tabBarProp);
    netWorkTimeProp && objExpressionArgs.push(netWorkTimeProp);
    windowProp && objExpressionArgs.push(windowProp);

    objExpressionArgs.push(appLayoutProp);
    callArgs.unshift(t.objectExpression(objExpressionArgs));
}

exports.initH5CreateCallArgs = function (params) {
    const {
        t,
        h5InitOpts,
        pageHookObj,
        callArgs,
        path,
        opts,
        declarationPath
    } = params;
    initH5AppCreateCallArgs(t, h5InitOpts, pageHookObj, callArgs);
    if (opts.isPage) {
        extractPageApi(t, path, opts, pageHookObj);
        extractLifeCycleHook(t, path, opts, pageHookObj, declarationPath);
    }
};
