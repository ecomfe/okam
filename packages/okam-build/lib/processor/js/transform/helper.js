/**
 * @file Transform helper
 * @author sparklewhy@gmail.com
 */

'use strict';

const {
    getBaseId,
    getFrameworkExtendId,
    normalizeInternalBehavior
} = require('../../../framework');

const LEADING_COMMENT_TYPE = 'leadingComments';
const TRAILING_COMMENT_TYPE = 'trailingComments';

/**
 * Convert the plain object node to javascript object
 *
 * @inner
 * @param {Object} node the plain object node
 * @param {Object} path the node path
 * @param {Object} t the babel type definition
 * @return {Object}
 */
function getPlainObjectNodeValue(node, path, t) {
    let result;
    if (t.isObjectExpression(node)) {
        result = {};

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

            if (!key) {
                continue;
            }

            result[key] = getPlainObjectNodeValue(subNode.value, path, t);
        }
    }
    else if (t.isArrayExpression(node)) {
        result = [];
        node.elements.forEach(item => {
            result.push(getPlainObjectNodeValue(item, path, t));
        });
    }
    else if (t.isLiteral(node)) {
        result = node.value;
    }
    else {
        throw path.buildCodeFrameError('only constant is supported');
    }
    return result;
}

/**
 * Create require variable declaration statement
 *
 * @param {string} varName the variable name
 * @param {string} requireId the required id
 * @param {Object} t the babel type definition
 * @return {Object}
 */
exports.createRequireVarDeclaration = function (varName, requireId, t) {
    return t.variableDeclaration(
        'var',
        [t.variableDeclarator(
            t.identifier(varName),
            t.callExpression(
                t.identifier('require'),
                [t.stringLiteral(requireId)]
            )
        )]
    );
};

/**
 * Create import declaration statement
 *
 * @param {string|Array.<string>} varName the variable name to export
 * @param {string} requireId the required id
 * @param {Object} t the babel type definition
 * @return {Object}
 */
exports.createImportDeclaration = function (varName, requireId, t) {
    let importSpecs = [];
    if (Array.isArray(varName)) {
        varName.forEach(item => {
            importSpecs.push(t.importSpecifier(
                t.identifier(item),
                t.identifier(item)
            ));
        });
    }
    else if (varName) {
        importSpecs = [t.importDefaultSpecifier(
            t.identifier(varName)
        )];
    }
    return t.importDeclaration(
        importSpecs,
        t.stringLiteral(requireId)
    );
};

/**
 * Create AST node by the given value
 *
 * @inner
 * @param {*} value the value to create
 * @param {Object} t the babel type definition
 * @return {?Object}
 */
function createNode(value, t) {
    if (Array.isArray(value)) {
        let elements = [];
        value.forEach(item => {
            let node = createNode(item, t);
            node && elements.push(node);
        });

        return t.arrayExpression(elements);
    }

    if (Object.prototype.toString.call(value) === '[object Object]') {
        let props = [];
        Object.keys(value).forEach(k => {
            let node = createNode(value[k], t);
            if (node) {
                props.push(t.objectProperty(
                    t.identifier(`'${k}'`),
                    node
                ));
            }
        });

        return t.objectExpression(props);
    }

    if (value == null) {
        return t.nullLiteral();
    }

    let valueType = typeof value;
    switch (valueType) {
        case 'boolean':
            return t.booleanLiteral(value);
        case 'string':
            return t.stringLiteral(value);
        case 'number':
            return t.numericLiteral(value);
    }
}

/**
 * Create simple plain object expression
 *
 * @param {Object} simpleObj the plain object
 * @param {Object} t the babel type definition
 * @return {Object}
 */
exports.createSimpleObjectExpression = function (simpleObj, t) {
    return createNode(simpleObj, t);
};

exports.getBaseId = getBaseId;

exports.getFrameworkExtendId = getFrameworkExtendId;

exports.normalizeInternalBehavior = normalizeInternalBehavior;

/**
 * Remove node comments
 *
 * @param {Object} t the babel type definition
 * @param {Object} path the node path
 * @param {string} type the comment type
 */
function removeComments(t, path, type) {
    let commentPaths = path.get(type);
    if (!commentPaths || !commentPaths.length) {
        return;
    }

    let isLeadingType = type === LEADING_COMMENT_TYPE;
    if (isLeadingType) {
        let parentPath = path.parentPath;
        let isParentProgram = parentPath && t.isProgram(parentPath.node);

        // move leading comments to program
        if (isParentProgram) {
            parentPath.addComments(
                'leading',
                commentPaths.map(item => item.node)
            );
        }
    }

    commentPaths.forEach(item => item.remove());
}

exports.removeComments = removeComments;

/**
 * Remove node
 *
 * @param {Object} t the babel type definition
 * @param {Object} path the node path to remove
 * @param {Object} commentsRemoveOpts the node comment remove options
 * @param {boolean=} commentsRemoveOpts.head whether remove leading comments,
 *        by default true if the parent of the removed node is program root node
 *        and the leading comments will be moved to the program root node.
 * @param {boolean=} commentsRemoveOpts.tail whether remove tailing comments,
 *        by default false
 */
exports.removeNode = function (t, path, commentsRemoveOpts = {}) {
    let {head, tail} = commentsRemoveOpts;
    if (head == null || head) {
        removeComments(t, path, LEADING_COMMENT_TYPE);
    }

    if (tail) {
        removeComments(t, path, TRAILING_COMMENT_TYPE);
    }

    path.remove();
};

/**
 * Convert ast plain object node to javascript plain object
 *
 * @param {Object} the ast node to convert
 * @param {Object} path the node path
 * @param {Object} t the babel type definition
 * @return {Object}
 */
exports.getPlainObjectNodeValue = getPlainObjectNodeValue;

/**
 * Check whether the given variable name is defined in its scope
 *
 * @param {Object} path the variable used path
 * @param {string} varName the variable name
 * @return {boolean}
 */
exports.isVariableDefined = function (path, varName) {
    return path.scope.hasBinding(varName);
};
