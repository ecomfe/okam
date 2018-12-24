/**
 * @file Filter transform helper
 * @author sparklewhy@gmail.com
 */

'use strict';

const {generateCode} = require('./helper');

function generateES6ModuleFilterCode(filterObjAst, t) {
    return t.program(
        [t.exportDefaultDeclaration(filterObjAst)],
        [t.directive(t.directiveLiteral('use strict'))]
    );
}

function generateCommonJSModuleFilterCode(filterObjAst, t) {
    return t.program(
        [
            t.expressionStatement(
                t.assignmentExpression(
                    '=',
                    t.memberExpression(
                        t.identifier('module'),
                        t.identifier('exports')
                    ),
                    filterObjAst
                )
            )
        ],
        [t.directive(t.directiveLiteral('use strict'))]
    );
}

/**
 * Get exported filter names
 *
 * @param {Object} node the filter definition node
 * @param {Object} t the babel type definition
 * @return {Array.<string>}
 */
exports.getExportFilterNames = function (node, t) {
    let result = {};
    if (t.isObjectExpression(node)) {
        let props = node.properties || [];
        for (let i = 0, len = props.length; i < len; i++) {
            let subNode = props[i];
            let keyNode = subNode.key;
            let key;
            if (t.isLiteral(keyNode)) {
                key = keyNode.value;
            }
            else if (t.isIdentifier(keyNode)) {
                key = keyNode.name;
            }

            key && (result[key] = true);
        }
    }

    return Object.keys(result);
};

/**
 * Generated filter code
 *
 * @param {Object} filterObjAst the filter definition ast
 * @param {Object} t the babel type definition
 * @param {Object=} options the generation option
 * @param {string=} options.format the module format, by default es6 module syntax
 *        the supported module format: es6/commonjs
 * @param {boolean=} options.usingBabel6 whether using babel6 processor, by default false
 * @return {string}
 */
function generateFilterCode(filterObjAst, t, options) {
    if (!filterObjAst.properties.length) {
        return '';
    }

    let {format = 'es6', usingBabel6} = options || {};
    let ast;
    if (format === 'es6') {
        ast = generateES6ModuleFilterCode(filterObjAst, t);
    }
    else {
        ast = generateCommonJSModuleFilterCode(filterObjAst, t);
    }

    return generateCode(ast, {
        auxiliaryCommentBefore: 'Auto generated filter code by okam'
    }, usingBabel6).code;
}

exports.generateCode = generateFilterCode;
