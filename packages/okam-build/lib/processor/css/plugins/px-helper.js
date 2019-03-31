/**
 * @file Pixel unit convert helper
 * @author xiaohong8023@outlook.com
 *         sparklewhy@gmail.com
 */

'use strict';

// 像素样式值正则常量
const PX_VALUE_REGEXP = /\b(\d+(\.\d+)?)px\b/g;

/**
 * 获取像素转换后的值
 *
 * @inner
 * @param {Object} node 要转换的像素值节点
 * @param {boolean=} noTrans1px 是否不转换 1px
 * @param {function(string): string} transform 自定义像素转换规则
 * @return {string}
 */
function getPxTransformValue(node, noTrans1px, transform) {
    return node.value.replace(PX_VALUE_REGEXP, (match, value) => {
        if (+value === 1 && noTrans1px) {
            return match;
        }

        return transform(node.value);
    });
}

function normalizeComment(value) {
    return value.trim().replace(/\s+/g, '-');
}

/**
 * 转换像素值
 *
 * @param {Object} cssAst 样式抽象语法树
 * @param {Object} opts 转换配置
 * @param {boolean=} opts.noTrans1px 是否不转换 1px
 * @param {function(string): string} opts.transform 自定义的像素转换规则
 * @param {string} opts.keepComment 声明不转的注释
 */
exports.transformPx = function (cssAst, opts) {
    const noTrans1px = !!opts.noTrans1px;
    const keepCommentContent = normalizeComment(opts.keepComment);
    const rawKeepComment = `/*${keepCommentContent}*/`;

    cssAst.walkRules(rule => {
        rule.walk(node => {
            if (node.type === 'decl' && PX_VALUE_REGEXP.test(node.value)) {
                let nodeRaws = node.raws;
                if (
                    nodeRaws.value
                    && nodeRaws.value.raw
                    && rawKeepComment === normalizeComment(nodeRaws.value.raw)
                ) {
                    return;
                }

                let nextNode = node.next();
                if (nextNode
                    && nextNode.type === 'comment'
                    && keepCommentContent === normalizeComment(nextNode.text)
                ) {
                    return;
                }

                node.value = getPxTransformValue(
                    node, noTrans1px, opts.transform
                );
            }
        });
    });
};

/**
 * 是否是 npm 文件路径
 *
 * @param {string} path 要判断的路径
 * @return {boolean}
 */
exports.isNPMFilePath = function (path) {
    if (path.indexOf('node_modules') !== -1) {
        return true;
    }
    return false;
};
