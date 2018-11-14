/**
 * @file start create project
 * @author xiaohong8023@outlook.com
 */

const fs = require('fs-extra');
const chalk = require('chalk');
const inquirer = require('inquirer');
const semver = require('semver');
const Etpl = require('./utils/etpl');
const isEmptyDir = require('./utils').isEmptyDir;
const BaseTemplate = require('../templates/index');

const {promptList, setPromptsValue} = require('./utils/prompts');

class Project {
    constructor(options) {

        const unSupportedVer = semver.lt(process.version, 'v8.0.0');
        if (unSupportedVer) {
            throw new Error('Node.js need update，upgrade to more than v8.0.0');
        }

        this.etplEngine = new Etpl();
        this.conf = Object.assign({
            dirName: null
        }, options);

        this.init();
    }

    init() {
        console.log(chalk.green('Create a new okam project'));
        console.log('Need help? Go and open issue: https://github.com/ecomfe/okam');
        console.log();
    }

    create() {
        this.ask().then(answers => {
            const date = new Date();
            this.conf = Object.assign(this.conf, answers);
            this.conf.dirName = this.conf.dirName || this.conf.projectName;
            this.conf.date = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
            this.write();
        });
    }

    ask() {
        const prompts = promptList.slice(0);
        const conf = this.conf;
        const dirName = conf.dirName;
        if (dirName && fs.existsSync(dirName) && (!isEmptyDir(dirName))) {
            this.conf.dirName = '';
            setPromptsValue(prompts, 'projectName', {
                message: 'The target directory is existed, change another name：'
            });
        }
        else if (dirName) {
            setPromptsValue(prompts, 'projectName', {
                'default': dirName
            });
        }
        else {
            setPromptsValue(prompts, 'projectName', {
                'default': 'my-okam-project'
            });
        }

        return inquirer.prompt(prompts);
    }

    write(cb) {
        new BaseTemplate(this, this.conf, {}, cb);
    }
}

module.exports = Project;
