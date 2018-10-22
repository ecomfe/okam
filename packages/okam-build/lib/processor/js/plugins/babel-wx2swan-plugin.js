/**
 * @file The babel plugin for wx api to swan api
 * @author xiaohong8023@outlook.com
 *
 * api
 *    - wx -> swan
 *    - 不同的
 *       - 做关系映射
 *           wx.createContext;
 *               -> MemberExpression | Identifier.
 *                   -> path.node.property.name
 *           wx['createContext'];
 *               -> MemberExpression | Literal(StringLiteral)
 *                   -> path.node.property.value
 *           wx.createContext();
 *               -> MemberExpression | Identifier.
 *                   -> path.node.property.name
 *           wx['createContext']();
 *               -> MemberExpression | Literal(StringLiteral)
 *                   -> path.node.property.value
 *    - todo： event 传参 统一
 */

'use strict';

// 不同的 做关系映射
const WX2SWAN_MAP = {
    createContext: 'createCanvasContext',
    navigateToMiniProgram: 'navigateToSmartProgram'
};

module.exports = function ({types: t}) {
    return {
        visitor: {
            Identifier(path, state) {
                // let opts = state.opts || {};
                if (path.node.name === 'wx') {
                    path.node.name = 'swan';
                }

            },

            /**
             * 不同 api 处理
             *
             * @param {[type]} path  [description]
             * @param {[type]} state [description]
             *
             * https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md
             */
            MemberExpression(path, state) {
                let property = path.node.property;

                // If computed is true  =>  (a[b]) property is an Expression.
                // If computed is false => (a.b) is an Identifier.
                let propertyKey = '';

                // wx.xxx
                if (!path.node.computed) {
                    propertyKey = 'name';
                }

                // wx[...]
                // only handle wx['xxx'], excluded wx[xxx], wx['x' + 'xx'] ...
                else if (t.isStringLiteral(property)) {
                    propertyKey = 'value';
                }

                let propertyContent = property[propertyKey];
                if (propertyContent && WX2SWAN_MAP.hasOwnProperty(propertyContent)) {
                    property[propertyKey] = WX2SWAN_MAP[propertyContent];
                }
            }
        }
    };
};
