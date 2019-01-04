/**
 * @file commit rule config
 * @see https://github.com/marionebl/commitlint/blob/master/docs/reference-rules.md
 * @see http://marionebl.github.io/commitlint
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const fs = require('fs');
const colors = require('chalk');
const settings = require('@commitlint/prompt/lib/settings');

Object.assign(settings, {
    type: {
        description: '<type> 说明提交的修改类型',
        enumerables: {
            wip: {
                description: '正常功能更新完善'
            },
            feat: {
                description: '新功能'
            },
            fix: {
                description: 'Bug修复'
            },
            chore: {
                description: '其它修改，非代码或者测试修改'
            },
            docs: {
                description: '文档修改'
            },
            style: {
                description: '代码格式修改'
            },
            refactor: {
                description: '代码重构，无新增功能'
            },
            perf: {
                description: '代码性能优化'
            },
            test: {
                description: '增加或修改测试用例'
            },
            build: {
                description: '构建或者外部依赖变更'
            },
            ci: {
                description: '变更 CI 相关配置或者脚本'
            },
            revert: {
                description: '回滚上次提交'
            }
        }
    },
    scope: {
        description: '<scope> 变更的模块名'
    },
    subject: {
        description: '<subject> 变更的摘要信息'
    },
    body: {
        description: '<body> 附加的变更说明',
        multline: true
    },
    footer: {
        description: '<footer> 提供进一步的重大调整说明等信息',
        multiline: true
    }
});

let changeTypes = settings.type.enumerables;
const COMMIT_TYPES = Object.keys(changeTypes).map(
    k => ({name: k, note: changeTypes[k].description})
);

function padding(value, len, isRight = true) {
    let curr = value.length;
    if (curr < len) {
        let whitespaces = '';
        for (let i = 0, num = len - curr; i < num; i++) {
            whitespaces += ' ';
        }
        isRight ? (value += whitespaces) : (value = whitespaces + value);
    }
    return value;
}

function printCommitFormatMessage(packages) {
    let prefix = '  ';
    let commitNote = 'commit message format:';
    console.log(
        prefix + colors.gray(commitNote),
        colors.cyan('<type>') + '(' + colors.cyan('<scope>') + '):',
        colors.green('<subject>')
    );
    console.log(
        prefix + padding('e.g.,', commitNote.length, false),
        colors.cyan('git commit -m'),
        colors.gray('feat(okam-build):'),
        colors.gray('add new stylus processor'),
        '\n'
    );

    console.log(prefix + colors.gray('types: (有效修改类型)'));
    let typeInfo = [];
    COMMIT_TYPES.forEach(
        ({name, note}) => typeInfo.push(
            prefix + colors.green(padding(name, 10)) + ' ' + colors.gray(note)
        )
    );
    console.log(typeInfo.join('\n'), '\n');

    console.log(prefix + colors.gray('scopes: (有效的模块包名)'));
    let scopeInfo = [];
    packages.forEach(item => scopeInfo.push(prefix + colors.green(item)));
    console.log(scopeInfo.join('\n'), '\n\n');
}

function getPackages(context) {
    let ctx = context || {};
    let cwd = ctx.cwd || process.cwd();
    let packagesRoot = path.join(cwd, 'packages');

    let packages = [];
    let files = fs.readdirSync(packagesRoot);
    for (let i = 0, len = files.length; i < len; i++) {
        let fileName = files[i];

        let fullPath = path.resolve(packagesRoot, fileName);
        let stat = fs.statSync(fullPath);
        let isDir = stat.isDirectory();
        if (isDir) {
            try {
                let packageInfo = require(path.join(fullPath, 'package.json'));
                packages.push(packageInfo.name);
            }
            catch (ex) {
                console.log(
                    colors.red('get package info fail: ' + fullPath)
                );
            }
        }
    }


    let result = packages.map(
        name => (name.charAt(0) === '@' ? name.split('/')[1] : name)
    );

    printCommitFormatMessage(result);

    return result;
}

module.exports = {
    utils: {getPackages},
    rules: {
        'body-leading-blank': [1, 'always'],
        'footer-leading-blank': [1, 'always'],
        'header-max-length': [2, 'always', 120],
        'scope-enum': ctx => [2, 'always', getPackages(ctx)],
        'scope-case': [2, 'always', 'lower-case'],
        'subject-case': [
            2,
            'never',
            ['sentence-case', 'start-case', 'pascal-case', 'upper-case']
        ],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'type-enum': [2, 'always', Object.keys(settings.type.enumerables)]
    }
};
