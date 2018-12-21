/**
 * @file px2rpx
 * @author xiaohong8023@outlook.com
 */

'use strict';

const pxRegExp = /\b(\d+(\.\d+)?)px\b/;

let keepComment = '';
let commentPureTextExp = null;
let commentRegExp = null;

class Px2rpx {

    /**
     * constructor
     *
     * @param {Object} opts 配置项
     * @param {number} opts.designWidth 视觉稿尺寸; default: 750
     * @param {number} opts.precision 精确度 保留的小数点单位; default: 2
     * @param {string} opts.keepComment 声明不转的注释; default: 'px2rpx: no'
     */
    constructor(opts) {
        this.designWidth = opts.designWidth || 750;
        this.precision = typeof opts.precision === 'undefined' ? 2 : opts.precision;
        this.proportion = 750 / this.designWidth;
        // 1px 不转
        this.noTrans1px = !!opts.noTrans1px;

        if (!keepComment) {
            keepComment = opts.keepComment || 'px2rpx\\s*?\\:\\s*?no';
            commentPureTextExp = new RegExp('^' + keepComment + '$');
            commentRegExp = new RegExp('\\/\\*\\s*?' + keepComment + '\\s*?\\*\\/');
        }
    }

    getCalcValue(type, value) {
        const pxGlobalRegExp = new RegExp(pxRegExp.source, 'g');

        return value.replace(pxGlobalRegExp, ($0, $1) => {
            if (+$1 === 1 && this.noTrans1px) {
                return $0;
            }
            let num = this.proportion * parseInt($1, 10);
            num = num.toFixed(this.precision);
            num = parseInt(num, 10) === +num ? parseInt(num, 10) : num;
            return `${num + type}`;
        });
    }

    generateRpx(cssAst) {
        const self = this;
        cssAst.walkRules(rule => {
            rule.walk(node => {
                if (node.type === 'decl' && pxRegExp.test(node.value)) {
                    let nodeRaws = node.raws;
                    if (
                        nodeRaws.value
                        && nodeRaws.value.raw
                        && commentRegExp.test(nodeRaws.value.raw)
                    ) {
                        return;
                    }

                    let nextNode = node.next();
                    if (nextNode
                        && nextNode.type === 'comment'
                        && commentPureTextExp.test(nextNode.text.trim())) {
                        return;
                    }

                    node.value = self.getCalcValue('rpx', node.value);
                }
            });
        });
    }
}

module.exports = exports = Px2rpx;
