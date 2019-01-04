/**
 * @file start create project
 * @author xiaohong8023@outlook.com
 */

const fs = require('fs-extra');
const chalk = require('chalk');
const inquirer = require('inquirer');
const semver = require('semver');
const execSync = require('child_process').execSync;
const ora = require('ora');
const Etpl = require('./utils/etpl');
const isEmptyDir = require('./utils').isEmptyDir;
const BaseTemplate = require('../templates/index');
const {promptUpdateCli, promptList, setPromptsValue} = require('./utils/prompts');

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
        console.log('Need help? Go and open issue: https://github.com/ecomfe/okam');
    }

    async needUpdateCli() {
        let localVersion = execSync('okam --version');
        localVersion = localVersion && localVersion.toString().trim();

        try {
            // 网不通情况下，等 3s，不更新;
            let remoteVersion = execSync('npm view okam-cli version', {
                timeout: 3000
            });
            remoteVersion = remoteVersion && remoteVersion.toString().trim();
            if (remoteVersion && (localVersion !== remoteVersion)) {
                console.log(chalk.cyan(`okam-cli(local: ${localVersion} -> latest: ${remoteVersion})`));
                let result =  await inquirer.prompt(promptUpdateCli);

                return !!result.cli;
            }
        }
        catch (e) {
        }

        return false;
    }

    async create() {

        let needUpdate = await this.needUpdateCli();

        if (needUpdate) {
            const spinner = ora('Upgrading the okam-cli version to the latest version...').start();

            try {
                let result = execSync('npm i -g okam-cli@latest');
                console.log(result.toString());
            }
            catch (e) {
                console.log(chalk.grey('encounter error while upgrading okam-cli'));
                console.log(chalk.grey('you can upgrad by yourself: okam update self'));
            }

            spinner.stop();
        }

        console.log(chalk.green('Create a new okam project'));

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
