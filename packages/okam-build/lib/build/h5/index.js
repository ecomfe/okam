/**
 * @file H5 build task manager. The h5 app is running over Vue framework.
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');
const {normalizeMiddlewares} = require('../../server/helper');
const {file: fileUtil} = require('../../util');
const {getRequirePath} = fileUtil;
const buildByWebpack = require('./webpack/build');

function getPageComponentName(modId, existedName) {
    let parts = modId.split('/');
    parts = parts.filter(item => item.trim());
    let lastIdx = parts.length - 1;
    let name = parts[lastIdx];
    if (name === 'index' && lastIdx > 0) {
        name = parts[lastIdx - 1] + 'Index';
    }

    let counter = 0;
    while (existedName[name]) {
        counter++;
        name += counter;
    }
    existedName[name] = true;
    return name;
}

function padding(spaceNum, str) {
    let prefix = '';
    while (spaceNum > 0) {
        spaceNum--;
        prefix += ' ';
    }
    return prefix + str;
}

class BuildH5AppManager extends BuildManager {

    constructor(buildConf) {
        super(buildConf);

        let resolver = this.resolver;
        let rawResolverFilter = resolver.resolveFilter;
        resolver.resolveFilter = (...args) => {
            let requireModId = args[0];
            let file = args[1];
            if (file.isEntryScript) {
                let appRouterModId = this.getAppRouterModuleId();
                if (appRouterModId === requireModId) {
                    return true;
                }
            }
            return rawResolverFilter && rawResolverFilter.apply(null, args);
        };

        this.isH5App = true;

        // using webpack dev server
        this.hasDevServer = true;

        // keep components property for Vue component
        this.keepComponentsProp = true;

        // covert component data property value to function type
        this.dataPropValueToFunc = true;

        // do not transform behavior(mixin) file
        this.ignoreBehaviorTransform = true;
    }

    /**
     * @override
     */
    getFilterTransformOptions() {
        // do not transform filters syntax
        return;
    }

    /**
     * @override
     */
    getAppRouterModuleId() {
        let appRouterModId = this.appRouterModId;
        if (!appRouterModId) {
            let entryFile;
            this.files.some(item => {
                if (item.isEntryScript) {
                    entryFile = item;
                    return true;
                }
                return false;
            });

            appRouterModId = this.appRouterModId = getRequirePath(
                this.getRouterFilePath(), entryFile.path
            );
        }

        return appRouterModId;
    }

    /**
     * Get the router file path
     *
     * @return {string}
     */
    getRouterFilePath() {
        return this.sourceDir + '/routes.js';
    }

    /**
     * Get app router info
     *
     * @return {string}
     */
    getAppRouteModuleCode() {
        let routerFilePath = this.getRouterFilePath();
        let importPageComponents = [];
        let routerList = [];
        let existedPageComponentName = {};
        this.files.forEach(item => {
            if (!item.isPageComponent) {
                return;
            }

            let pageFilePath = item.path;
            let pageModId = getRequirePath(pageFilePath, routerFilePath);
            let pageName = getPageComponentName(pageModId, existedPageComponentName);
            importPageComponents.push(`import ${pageName} from '${pageModId}';`);

            let routePath = pageModId.replace('./', '/');
            let routerItem = padding(4, '{\n');
            routerItem += padding(8, `component: ${pageName},\n`);
            routerItem += padding(8, `path: '${routePath}'\n`);
            // routerItem += padding(8, `props: {title: '${config.title}}'`);
            routerItem += padding(4, '}');
            routerList.push(routerItem);

            if (item.isHomePage) {
                this.homePagePath = routePath;
            }
        });

        let routerConfigStr = `\n\n\nexport default [\n${routerList.join(',\n')}\n];\n`;
        return '/* Auto generated router config code by okam */\n\n'
            + importPageComponents.join('\n') + routerConfigStr;

    }

    /**
     * Run the post build
     *
     * @return {Promise}
     */
    runPostBuild() {
        const {output, server, webpack} = this.buildConf;
        let devServerMws;
        if (server) {
            const {port, middlewares} = server;
            webpack.devServer = Object.assign({}, webpack.devServer);
            if (port && !webpack.devServer.port) {
                webpack.devServer.port = port;
            }

            devServerMws = normalizeMiddlewares(middlewares, this.root);
        }
        else {
            delete webpack.devServer;
        }

        const options = {
            webpack,
            devServerMws,
            root: this.root,
            sourceDir: output.dir,
            homePath: this.homePagePath || '/'
        };
        return buildByWebpack(this.isDev, options, this.logger);
    }
}

module.exports = BuildH5AppManager;
