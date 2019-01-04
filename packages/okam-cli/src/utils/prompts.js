/**
 * @file prompts
 * @author xiaohong8023@outlook.com
 */

const fs = require('fs-extra');
const {getAuthor, isEmptyDir} = require('./index');

function setPromptsValue(prompts, name, options) {
    let promptsLen = prompts.length;
    for (let i = 0; i < promptsLen; i++) {
        if (prompts[i].name === name) {
            prompts[i] = Object.assign({}, prompts[i], options);
            return;
        }
    }
}

let promptList = [
    {
        'type': 'input',
        'name': 'projectName',
        'message': 'Project name：',
        /* eslint-disable fecs-use-method-definition */
        'validate': function (input) {
            if (!input) {
                return 'The project name can not be empty!';
            }
            if (fs.existsSync(input) && (!isEmptyDir(input))) {
                return 'The target directory is existed, please change another name！';
            }
            return true;
        }
    },
    {
        'type': 'input',
        'name': 'description',
        'default': 'A okam project',
        'message': 'Project description：'
    },
    {
        'type': 'input',
        'name': 'author',
        'default': getAuthor(),
        'message': 'Author'
    },
    {
        'type': 'list',
        'name': 'template',
        'message': 'Please choose template syntax：',
        'choices': [
            {
                'name': 'Normal template',
                'value': 'normal'
            },
            {
                'name': 'Pug template',
                'value': 'pug'
            }
        ]
    },
    {
        'type': 'list',
        'name': 'script',
        'message': 'Please choose script syntax：',
        'choices': [
            {
                'name': 'Javascript(babel7)',
                'value': 'babel7'
            },
            {
                'name': 'Javascript(babel6)',
                'value': 'babel'
            },
            {
                'name': 'Typescript',
                'value': 'typescript'
            }
        ]
    },
    {
        'type': 'list',
        'name': 'style',
        'message': 'Please choose style syntax：',
        'choices': [
            {
                'name': 'stylus',
                'value': 'stylus'
            },
            {
                'name': 'less',
                'value': 'less'
            },
            {
                'name': 'scss/sass',
                'value': 'scss'
            },
            {
                'name': 'css',
                'value': 'css'
            }
        ]
    },
    {
        'type': 'input',
        'name': 'sfcExt',
        'default': 'vue',
        'message': 'Please input single file component suffix name'
    },
    {
        'type': 'confirm',
        'name': 'redux',
        'default': false,
        'message': 'Use Redux in your project?'
    },
    {
        'type': 'confirm',
        'name': 'async',
        'message': 'Use Promise, Async/Await in your project?'
    },
    {
        'type': 'confirm',
        'name': 'px2rpx',
        'message': 'Use px2rpx in your project(designWidth: 1242)?'
    },
    {
        'type': 'confirm',
        'name': 'tinyimg',
        'message': 'Use tinyimg in your project?'
    },
    {
        'type': 'list',
        'name': 'lint',
        'message': 'Lint your code?',
        'choices': [
            {
                'name': 'FECS',
                'value': 'fecs'
            },
            {
                'name': 'ESLint',
                'value': 'eslint'
            },
            {
                'name': 'NONE',
                'value': 'lintnone'
            }
        ]
    }
];

let promptUpdateCli = {
    'type': 'confirm',
    'name': 'cli',
    'default': true,
    'message': 'update okam-cli now ?'
};

module.exports = {
    promptUpdateCli,
    promptList,
    setPromptsValue
};
