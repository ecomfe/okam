/**
 * @file Resolve npm dependencies
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * Resolve the required module id and replace the old module id using the
 * resolved module id.
 *
 * @inner
 * @param {Object} t the babel type definition
 * @param {Object} path the node path
 * @param {Object} state the transformation plugin state
 */
function tryToResolveRequireModId(t, path, state) {
    let opts = state.opts || {};
    let resolveRequireId = opts.resolveDepRequireId;

    let exportNode = path.node;
    let source = exportNode.source;
    if (!t.isStringLiteral(source)) {
        return;
    }

    let modId = source.value;
    let newModId = resolveRequireId(modId);
    if (newModId && newModId !== modId) {
        let requireIdNode = path.get('source');
        requireIdNode.replaceWith(
            t.stringLiteral(newModId)
        );
    }
}

module.exports = function ({types: t}) {
    return {
        visitor: {

            /**
             * Resolve the `require(xxx)` statement module id
             *
             * @param {Object} path the node path
             * @param {Object} state the transformation plugin state
             */
            CallExpression(path, state) {
                let opts = state.opts || {};
                let resolveRequireId = opts.resolveDepRequireId;

                let callNode = path.node;
                let callName = callNode.callee.name;
                if (callName !== 'require') {
                    return;
                }

                let args = callNode.arguments;
                if (!Array.isArray(args)
                    || args.length !== 1
                    || !t.isStringLiteral(args[0])
                ) {
                    return;
                }

                let modId = args[0].value;
                let newModId = resolveRequireId(modId);
                if (newModId && newModId !== modId) {
                    let requireIdNode = path.get('arguments.0');
                    requireIdNode.replaceWith(
                        t.stringLiteral(newModId)
                    );
                }
            },

            /**
             * Resolve the `import xxx from xxx` statement module id
             *
             * @param {Object} path the node path
             * @param {Object} state the transformation plugin state
             */
            ImportDeclaration(path, state) {
                tryToResolveRequireModId(t, path, state);
            },

            /**
             * Resolve the `export * from xxx ` statement module id
             *
             * @param {Object} path the node path
             * @param {Object} state the transformation plugin state
             */
            ExportAllDeclaration(path, state) {
                tryToResolveRequireModId(t, path, state);
            },

            /**
             * Resolve the `export {xx} from xxx` statement module id
             *
             * @param {Object} path the node path
             * @param {Object} state the transformation plugin state
             */
            ExportNamedDeclaration(path, state) {
                tryToResolveRequireModId(t, path, state);
            }
        }
    };
};
