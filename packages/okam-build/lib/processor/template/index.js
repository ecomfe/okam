/**
 * @file template parser
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
/* eslint-disable fecs-prefer-destructure */
const {parse: parseDom} = require('./parser');
const serializeDom = require('./serializer');

function visit(ctx, node, plugins, tplOpts) {
    let type = node.type;
    let visitors = plugins[type];
    if (visitors) {
        for (let i = 0, len = visitors.length; i < len; i++) {
            let transform = visitors[i];
            transform[0].call(ctx, node, tplOpts, transform[1]);

            if (ctx.isSkip || ctx.isStop) {
                return;
            }
        }
    }

    let children = node.children;
    if (node.removed || !children) {
        return;
    }

    let childNum = children.length;
    for (let i = 0; i < childNum; i++) {
        let child = children[i];
        visit(ctx, child, plugins, tplOpts);
        if (ctx.isStop) {
            return;
        }

        if (ctx.isNodeChange) {
            childNum = children.length;
            ctx.nodeChange(false);
        }
    }
}

function createTransformContext() {
    let skip = false;
    let stop = false;
    let nodeChange = false;
    let ctx = {
        stop() { // skip the remain nodes and exit
            stop = true;
        },
        skip() { // skip the children of the current processed node
            skip = true;
        },
        nodeChange(val) {
            nodeChange = val == null ? true : !!val;
        }
    };

    Object.defineProperties(ctx, {
        isSkip: {
            get() {
                return skip;
            }
        },

        isStop: {
            get() {
                return stop;
            }
        },

        isNodeChange: {
            get() {
                return nodeChange;
            }
        },

        /* eslint-disable fecs-camelcase */
        _reset: {
            get() {
                return () => {
                    skip = stop = false;
                };
            }
        }
    });

    return ctx;
}

function transformAst(ast, plugins, tplOpts) {
    let ctx = createTransformContext();

    // visit root node
    visit(ctx, ast, plugins, tplOpts);
}

/**
 * Merge the plugin visitors by the visited node type.
 * e.g., [ [transform, options], [transform, options] ]
 * => {tag: [ [tagVisitor, options], [tagVisitor, options] ]}
 *
 * @inner
 * @param {Array.<Object>} plugins the plugins to merge
 * @return {Object}
 */
function mergeVisitors(plugins) {
    let result = {};
    plugins.forEach(item => {
        let transform = item;
        let options;
        if (Array.isArray(item)) {
            [transform, options] = item;
        }

        typeof transform === 'string' && (transform = require(transform));

        Object.keys(transform).forEach(type => {
            let visitor = transform[type];
            let list = result[type];
            list || (list = result[type] = []);
            list.push([
                visitor, options
            ]);
        });
    });

    return result;
}

/**
 * Compile template
 *
 * @param {Object} file the file to compile
 * @param {Object} options compile option
 * @param {Object} options.config compile config
 * @param {Array.<Array|Object>} options.config.plugins the template transform plugins
 *        the plugin item structure: `[transform, options]` or `transform`
 * @return {Object}
 */
function compileTpl(file, options) {
    let {config} = options;
    let allowCache = !config || config.cache == null || config.cache;
    let content = file.content.toString();
    const ast = file.ast || parseDom(content);
    allowCache && (file.ast = ast);

    let plugins = mergeVisitors((config && config.plugins) || []);

    transformAst(
        ast, plugins,
        Object.assign({}, options, {file})
    );

    let {keepOriginalContent} = config || {};
    if (!keepOriginalContent) {
        // serialize by xml mode, close all elements
        content = serializeDom(ast, {xmlMode: true});
    }

    return {
        ast,
        content
    };
}

module.exports = exports = compileTpl;
