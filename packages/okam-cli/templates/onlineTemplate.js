/**
 * @file online template hanlder
 * @author xiaohong8023@outlook.com
 *
 *
 */

const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

class OnlineTemplate {
    constructor(creater, params, helper, cb) {
        this.creater = creater;
        this.params = params;
        this.helper = helper;

        // current project path
        this.projectPath = path.join(process.cwd(), this.params.pkgName);

        this.templatePath = this.projectPath;

        // start create project
        this.create();

        if (typeof cb === 'function') {
            cb();
        }
    }

    async create() {
        const spinner = ora('Creating the project, please wait a moment...').start();

        // 当前仅处理了两个文件
        const renderFiles = ['package.json', 'README.md'];

        renderFiles.forEach(fileName => {
            this.creater.etplEngine.renderTplToFile(
                path.join(this.templatePath, fileName),
                path.join(this.projectPath, fileName),
                this.params
            );
        });

        spinner.stop();
        this.endGuide();
    }

    /**
     * end guide
     */
    endGuide() {
        console.log(chalk.green('The project was created successfully!'));
        console.log('# prepare');
        console.log(`    cd ${this.params.pkgName} && npm i`);
        console.log('# start');
        console.log('    see README.md');
    }
}

module.exports = OnlineTemplate;
