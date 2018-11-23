/**
 * @file default.js
 * @author xiaohong8023@outlook.com
 */

const fs = require('fs-extra');
const path = require('path');
const getLatestVersion = require('latest-version');
const chalk = require('chalk');
const ora = require('ora');

/**
 * 获取给定的文件路径的状态信息
 *
 * @inner
 * @param {string} target 文件的目标路径
 * @return {?Object}
 */
function getFileState(target) {
    try {
        let state = fs.statSync(target);
        return state;
    }
    catch (ex) {
        // ignore
    }
}

/**
 * script extname
 *
 * @type {Object}
 * @const
 */
const SCRIPT_EXT_MAP = {
    babel: 'js',
    babel7: 'js',
    typescript: 'ts'
};

/**
 * style extname
 *
 * @type {Object}
 * @const
 */
const STYLE_EXT_MAP = {
    sass: 'scss',
    less: 'less',
    stylus: 'styl',
    none: 'css'
};

/**
 * dev package name
 *
 * @type {String}
 * @const
 */
const PACKAGE_NAME_CORE = 'okam-core';

/**
 * utils/prompts 中 对应需要加包的项
 *
 * @type {Array}
 * @const
 */
const PROMPT_PACKAGE_KEYS = ['template', 'script', 'style', 'redux', 'async', 'server', 'tinyimg', 'lint'];

/**
 * package names map
 *
 * @type {Object}
 * @const
 */
const PACKAGE_NAMES_MAP = {
    devDepsMust: ['okam-build', 'cross-env', 'postcss', 'postcss-url', 'json5'],
    devDeps: {
        eslint: ['eslint', 'eslint-plugin-babel', 'babel-eslint', 'husky', 'lint-staged'],
        fecs: ['fecs', 'husky', 'lint-staged'],
        tinyimg: ['okam-plugin-tinyimg'],
        server: ['connect'],
        redux: ['redux'],
        pug: ['pug'],
        async: ['regenerator-runtime'],
        babel7: ['@babel/core', '@babel/preset-env'],
        babel: ['babel-core', 'babel-preset-env'],
        typescript: ['@babel/core', '@babel/preset-typescript'],
        stylus: ['stylus'],
        less: ['less'],
        sass: ['node-sass']
    }
};

class BaseTemplate {
    constructor(creater, params, helper, cb) {
        this.creater = creater;
        this.params = params;
        this.helper = helper;

        // current project path
        this.projectPath = path.join(process.cwd(), this.params.dirName);

        // template path
        this.templatePath = path.join(__dirname, 'base');

        this.initParam();

        // start create project
        this.create();

        if (typeof cb === 'function') {
            cb();
        }
    }

    initParam() {
        let styleExt = STYLE_EXT_MAP[this.params.style] || 'css';
        let scriptExt = SCRIPT_EXT_MAP[this.params.script] || 'js';
        let sfcExt = this.params.sfcExt || 'okm';
        this.params = Object.assign(
            {},
            this.params,
            {
                styleExt,
                scriptExt,
                sfcExt
            }
        );
    }

    async create() {
        const spinner = ora('Creating the project, please wait a moment...').start();

        // scripts/ files
        this.traverseFilesAndCb(
            path.join(this.templatePath, 'scripts'),
            this.generateBuild.bind(this)
        );

        // src/ files
        this.traverseFilesAndCb(
            path.join(this.templatePath, 'src'),
            this.generateNormalFiles.bind(this)
        );

        // . files
        this.traverseFilesAndCb(
            path.join(this.templatePath, 'dotFilesAll'),
            this.generateDotFilesAll.bind(this)
        );

        // redux
        if (this.params.redux) {
            this.traverseFilesAndCb(
                path.join(this.templatePath, 'reduxSrc'),
                this.generateReduxFiles.bind(this)
            );
        }

        // fecs
        if (this.params.lint === 'fecs') {
            this.traverseFilesAndCb(
                path.join(this.templatePath, 'dotFilesFecs'),
                this.generateDotFilesFecs.bind(this)
            );
        }

        // eslint
        if (this.params.lint === 'eslint') {
            this.traverseFilesAndCb(
                path.join(this.templatePath, 'dotFilesESLint'),
                this.generateDotFilesESLint.bind(this)
            );
        }

        // other files
        await this.generateOthers();

        spinner.stop();
        this.endGuide();
    }

    /**
     * end guide
     */
    endGuide() {
        console.log(chalk.green('The project was created successfully!'));
        console.log('# prepare');
        console.log(`    cd ${this.params.dirName}`);
        console.log('    npm i');
        console.log('# start');
        console.log('    swan:');
        console.log('        npm run dev');
        console.log('        npm run dev:clean');
        console.log('        npm run dev:server');
        console.log('        npm run build');
        console.log('        npm run prod');
        console.log('');
        console.log('    wx:');
        console.log('        npm run dev:wx');
        console.log('        npm run dev:wx:clean');
        console.log('        npm run dev:wx:server');
        console.log('        npm run build:wx');
        console.log('        npm run prod:wx');
        console.log('');
        console.log('    ant:');
        console.log('        npm run dev:ant');
        console.log('        npm run dev:ant:clean');
        console.log('        npm run dev:ant:server');
        console.log('        npm run build:ant');
        console.log('        npm run prod:ant');
        console.log('# join your self');
    }

    generateDotFilesAll(fullPath) {
        this.generateDotFiles(fullPath, 'dotFilesAll');
    }

    generateDotFilesESLint(fullPath) {
        this.generateDotFiles(fullPath, 'dotFilesESLint');
    }

    generateDotFilesFecs(fullPath) {
        this.generateDotFiles(fullPath, 'dotFilesFecs');
    }

    /**
     * 生成 . 相关文件 不需要 render
     *
     * @param  {string} fullPath fullPath
     * @param  {string} dir 目录名
     */
    generateDotFiles(fullPath, dir) {
        let fileName = path.relative(path.join(this.templatePath, dir), fullPath);
        let projectFilePath = path.join(this.projectPath, '.' + fileName);
        fs.copy(fullPath, projectFilePath);
    }

    /**
     * 生成 构建相关文件
     *
     * @param  {string} fullPath fullPath
     */
    generateBuild(fullPath) {
        let relativePath = path.relative(this.templatePath, fullPath);
        let projectFilePath = path.resolve(this.projectPath, relativePath);

        this.creater.etplEngine.renderTplToFile(
            fullPath,
            projectFilePath,
            this.params
        );
    }

    /**
     * 生成 src 中 redux 相关文件
     *
     * @param  {string} fullPath fullPath
     */
    generateReduxFiles(fullPath) {
        let relativePath = path.relative(path.join(this.templatePath, 'reduxSrc'), fullPath);
        let projectFilePath = path.resolve(path.join(this.projectPath, 'src'), relativePath);
        this.moveSrcFiles(fullPath, projectFilePath);
    }

    /**
     * 生成 日常的 src 下的项目文件
     *
     * @param  {string} fullPath fullPath
     */
    generateNormalFiles(fullPath) {
        let relativePath = path.relative(this.templatePath, fullPath);
        let projectFilePath = path.resolve(this.projectPath, relativePath);
        this.moveSrcFiles(fullPath, projectFilePath);
    }

    /**
     * 生成 其他相关文件
     */
    async generateOthers() {
        let coreVersion = await getLatestVersion(PACKAGE_NAME_CORE);
        let devDepsInfo = await this.getPackagesDevDepsNameAndVersion();

        this.creater.etplEngine.renderTplToFile(
            path.join(this.templatePath, 'packagejson'),
            path.join(this.projectPath, 'package.json'),
            Object.assign(
                {},
                this.params,
                {
                    coreVersion,
                    devDeps: devDepsInfo
                }
            )
        );
        this.creater.etplEngine.renderTplToFile(
            path.join(this.templatePath, 'project.json5'),
            path.join(this.projectPath, 'project.json5'),
            this.params
        );
        this.creater.etplEngine.renderTplToFile(
            path.join(this.templatePath, 'README.md'),
            path.join(this.projectPath, 'README.md'),
            this.params
        );
    }

    /**
     * 获取依赖的包 及 版本号
     *
     * @return {[Object]} []
     */
    async getPackagesDevDepsNameAndVersion() {
        let pkgNames = [];

        Array.prototype.push.apply(pkgNames, PACKAGE_NAMES_MAP.devDepsMust);

        PROMPT_PACKAGE_KEYS.forEach(key => {
            let name = typeof this.params[key] === 'boolean'
                ? key
                : this.params[key];
            PACKAGE_NAMES_MAP.devDeps[name] && Array.prototype.push.apply(
                pkgNames,
                PACKAGE_NAMES_MAP.devDeps[name]
            );
        });
        let devDeps = await Promise.all(pkgNames.map(async name => {
            let version = await getLatestVersion(name);
            let info = {
                name,
                version: `${version}`
            };
            return info;
        }));

        devDeps.sort(function (a, b) {
            return a.name > b.name;
        });

        return devDeps;
    }

    /**
     * move src下的文件
     *
     * @param  {string} fullPath 当前 path
     * @param  {string} projectFilePath 最终项目 path
     */
    moveSrcFiles(fullPath, projectFilePath) {
        let extname = path.extname(fullPath);

        if (/\.(png|jpe?g|gif)(\?.*)?$/.test(fullPath)) {
            fs.copy(fullPath, projectFilePath);
            return;
        }

        if (extname === '.okm') {
            projectFilePath = projectFilePath.replace(extname, '.' + this.params.sfcExt);
        }
        if (extname === '.js') {
            projectFilePath = projectFilePath.replace(extname, '.' + this.params.scriptExt);
        }
        if (extname === '.styl') {
            projectFilePath = projectFilePath.replace(extname, '.' + this.params.styleExt);
        }

        this.creater.etplEngine.renderTplToFile(
            fullPath,
            projectFilePath,
            this.params
        );
    }

    /**
     * 遍历当前文件夹下的文件并进行回调操作
     *
     * @param  {string}   curDir 当前的目录
     * @param  {Function} cb callback function
     */
    traverseFilesAndCb(curDir, cb) {
        let fileDirs = [curDir];
        while (fileDirs.length) {
            let currDir = fileDirs.pop();
            let files = fs.readdirSync(currDir);
            for (let i = 0, len = files.length; i < len; i++) {
                let fileName = files[i];

                if (/^\./.test(fileName)) {
                    continue;
                }

                let fullPath = path.resolve(currDir, fileName);
                let stat = getFileState(fullPath);
                if (!stat) {
                    continue;
                }

                let isDir = stat.isDirectory();
                if (isDir) {
                    fileDirs.push(fullPath);
                    continue;
                }

                if (typeof cb === 'function') {
                    cb(fullPath);
                }
            }
        }
    }
}

module.exports = BaseTemplate;
