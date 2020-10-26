/**
 * @file H5 build task manager. The h5 app is running over Vue framework.
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');
const {normalizeMiddlewares} = require('../../server/helper');
const {file: fileUtil, string: strUtil} = require('../../util');
const {getRequirePath} = fileUtil;
const buildByWebpack = require('okam-build-h5');

function getPageComponentName(modId, existedName) {
    let parts = modId.split('/');
    parts = parts.filter(item => item.trim());
    let lastIdx = parts.length - 1;
    let name = parts[lastIdx];
    if (name === 'index' && lastIdx > 0) {
        name = formatPart(parts[lastIdx - 1]) + 'Index';
    }

    let counter = 0;
    while (existedName[name]) {
        counter++;
        name += counter;
    }
    existedName[name] = true;
    return name;
}

// 对文件名以短横线链接的做下处理
function formatPart(fileName) {
    if (fileName.indexOf('-') === -1) {
        return fileName;
    }
    const part = fileName.split('-');
    return part.map((item, index) => {
        if (index !== 0) {
            return item.slice(0, 1).toUpperCase() + item.slice(1);
        }
        return item;
    }).join('');
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

        // ignore router module resolve
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
        this.usingCustomDevServer = true;
    }

    /**
     * @override
     */
    isNativeSupportVue() {
        return true;
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
     * Generate app router code
     *
     * @private
     * @return {Object}
     */
    generateAppRouteCode() {
        let routerFile = this.routerFile;
        let importPageComponents = [];
        let routerList = [];
        let existedPageComponentName = {};
        this.files.forEach(item => {
            if (!item.isPageComponent) {
                return;
            }

            let pageModId = getRequirePath(item.path, routerFile.path);
            // ensure not reserved words is used, so here add underscore as prefix
            let pageName = '_' + getPageComponentName(pageModId, existedPageComponentName);
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

        return {
            importCode: importPageComponents,
            routerList
        };
    }

    /**
     * Generate app global component registration code
     *
     * @private
     * @return {Object}
     */
    generateGlobalComponentRegistrationCode() {
        let result = {};
        this.files.forEach(item => {
            item.subFiles && item.subFiles.forEach(subItem => {
                if (subItem.injectComponents) {
                    Object.assign(result, subItem.injectComponents);
                }
            });

            item.injectComponents
                && Object.assign(result, item.injectComponents);
        });

        const routerFile = this.routerFile;
        let importCode = [
            'import Vue from \'vue\';'
        ];
        let declareCode = [];
        Object.keys(result).forEach(k => {
            let {isNpmMod, modPath} = result[k];
            let id = isNpmMod
                ? modPath
                : getRequirePath(modPath, routerFile.fullPath);
            let compName = strUtil.toCamelCase(k);
            importCode.push(`import ${compName} from '${id}';`);
            declareCode.push(`Vue.component('${k}', ${compName});`);
        });

        if (!declareCode.length) {
            importCode = [];
        }

        return {
            importCode,
            declareCode
        };
    }

    /**
     * Init router file module code
     *
     * @private
     * @return {boolean} return true if init successfully
     */
    initRouterFileCode() {
        let {
            importCode,
            routerList
        } = this.generateAppRouteCode();

        let {
            importCode: importComponentCode,
            declareCode
        } = this.generateGlobalComponentRegistrationCode();

        let code = importComponentCode.concat(importCode, declareCode);
        code.push('\n');
        code.push('\n');

        let routerCode = `export default [\n${routerList.join(',\n')}\n];`;
        code.push(routerCode);
        code.push('\n');

        code = '/* Auto generated router config code by okam */\n\n'
            + code.join('\n');

        if (this.routerFile.rawContent !== code) {
            this.routerFile.content = code;
            this.routerFile.rawContent = code;
            return true;
        }

        return false;
    }

    /**
     * Update router file content
     *
     * @param {Timer=} t the timer
     * @return {boolean} return true if update successfully
     */
    updateRouterFileContent(t) {
        if (!this.initRouterFileCode()) {
            return false;
        }

        this.addNeedBuildFile(this.routerFile, true);

        // build files that need to compile
        this.buildDependencies(t);
        return true;
    }

    /**
     * Processor the app config after build done
     *
     * @param {Timer=} t the timer
     */
    onBuildDone(t) {
        this.updateRouterFileContent(t);
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

        // disable webpack post build
        if (webpack && webpack.disabled) {
            return;
        }

        // using custom webpack build
        if (typeof webpack === 'function') {
            return webpack(this.isDev, options, this.logger);
        }

        // using builtin webpack build
        return buildByWebpack(this.isDev, options, this.logger);
    }
}

module.exports = BuildH5AppManager;
