/**
 * @file The processor helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
/* eslint-disable fecs-prefer-destructure */
/* eslint-disable fecs-use-for-of */

const mm = require('minimatch');
const customRequire = require('../../util').require;
const {merge} = require('../../util');
const BUILTIN_PROCESSORS = require('../type').BUILTIN_PROCESSORS;
const initBabelProcessorOptions = require('./init-babel');
const initViewProcessorOptions = require('./init-view');

/**
 * The default babel processor to use
 *
 * @const
 * @type {string}
 */
const DEFAULT_BABEL_PROCESSOR = 'babel';

function hasBabelProcessor(processorName) {
    return (processorName === 'babel'
        || processorName === 'babel7'
        || processorName === 'typescript'
    );
}

function isMatch(file, pattern) {
    let typeStr = typeof pattern;
    if (typeStr === 'string') {
        return mm(file.path, pattern, {matchBase: true});
    }
    else if (typeStr === 'function') {
        return !!pattern(file);
    }
    else if (pattern instanceof RegExp) {
        return pattern.test(file.path);
    }
    return false;
}

function normalizeProcessor(processor, file) {
    if (!processor) {
        return;
    }

    if (typeof processor === 'function') {
        processor = processor(file);
    }

    let processorName = processor;
    let processorOpts;

    if (Array.isArray(processorName)) {
        let arr = processorName;
        if (arr.length === 2
            && typeof arr[0] === 'string'
            && typeof arr[1] === 'object'
        ) {
            processorName = arr[0];
            processorOpts = arr[1];
        }
        else {
            return arr.map(item => ({
                name: item,
                options: {}
            }));
        }
    }
    else if (typeof processor === 'object') {
        processorName = processor.name;
        processorOpts = processor.options;
    }

    return {
        name: processorName,
        options: processorOpts || {}
    };
}

function resolveProcessor(name, root, logger) {
    let resolveNames = [name];
    let optName = `okam-plugin-${name}`;
    if (!resolveNames.includes(optName)) {
        resolveNames.unshift(optName);
    }

    let result;
    resolveNames.some(k => {
        try {
            result = customRequire(k, root);
        }
        catch (ex) {
            // ignore
        }
        return !!result;
    });

    if (!result) {
        logger.error(
            `unknown processor name ${name},`,
            'you can try execute: `npm i',
            resolveNames[0] + ' -D`',
            'or install `' + resolveNames[1] + '`',
            'to fix it'
        );
    }
    return result;
}

function getBuiltinProcessor(file, processorInfo, buildManager) {
    let {name: processorName, options: processorOpts} = processorInfo;
    let {root, logger} = buildManager;
    let result = BUILTIN_PROCESSORS[processorName];
    if (!result) {
        result = resolveProcessor(processorName, root, logger);
        if (result) {
            result = {
                processor: result
            };

            // cache custom processor
            BUILTIN_PROCESSORS[processorName] = result;
        }
        else {
            return;
        }
    }

    if (!result._resovled && result.deps && result.deps.length) {
        result._resovled = true;
        try {
            customRequire.ensure(processorName, result.deps, root);
        }
        catch (ex) {
            logger.error(ex.toString());
            process.exit(1);
        }
    }

    // merge default options
    let defaultOpts = result.options;
    if (defaultOpts) {
        processorOpts = merge({}, defaultOpts, processorOpts);
    }

    // init babel transform extra options
    if (hasBabelProcessor(processorName)) {
        processorOpts = initBabelProcessorOptions(
            file, processorOpts, buildManager
        );
    }
    else if (processorName === 'view') {
        processorOpts = initViewProcessorOptions(
            processorOpts, buildManager
        );
    }

    let handler = result.processor;
    if (typeof handler === 'string') {
        handler = customRequire(handler);
    }

    // call before hook
    let hook = result.hook;
    if (hook && typeof hook.before === 'function') {
        hook.before(file, processorOpts);
    }

    return {
        name: processorName,
        handler,
        options: processorOpts,
        rext: result.rext
    };
}

function getProcessor(processor, file, buildManager) {
    let processorInfo = normalizeProcessor(processor, file);
    if (!processorInfo) {
        return;
    }

    if (!Array.isArray(processorInfo)) {
        processorInfo = [processorInfo];
    }

    return processorInfo.map(item => {
        if (typeof item.name === 'string') {
            return getBuiltinProcessor(file, item, buildManager);
        }
        return item;
    });
}

function addScriptDefaultBabelProcessor(file, buildManager, processors) {
    let hasBabel = processors.some(item => hasBabelProcessor(item.name));
    if (!hasBabel) {
        processors.unshift(
            getBuiltinProcessor(
                file, {name: DEFAULT_BABEL_PROCESSOR, options: {}}, buildManager
            )
        );
    }
}

function findMatchProcessor(file, rules, buildManager) {
    let logger = buildManager.logger;
    let matchProcessors = [];
    let unknownProcessors = [];

    rules || (rules = []);
    for (let r = 0, rLen = rules.length; r < rLen; r++) {
        let ruleItem = rules[r];
        if (!isMatch(file, ruleItem.match)) {
            continue;
        }

        let processors = ruleItem.processors || [];
        let isArr = Array.isArray(processors);
        let isFunc = typeof processors === 'function';
        if (isFunc) {
            logger.warn('`processors` function type is not supported');
            continue;
        }

        for (let k in processors) {
            if (processors.hasOwnProperty(k)) {
                let item = processors[k];
                if (!isArr) {
                    item = {name: k, options: item};
                }

                let result = getProcessor(item, file, buildManager);
                if (Array.isArray(result)) {
                    matchProcessors.push.apply(matchProcessors, result);
                }
                else if (result) {
                    matchProcessors.push(result);
                }
                else {
                    unknownProcessors.push({ruleIndex: r, processorIndex: k});
                }
            }
        }
    }

    if (unknownProcessors.length) {
        logger.warn('unknown rule processors', unknownProcessors);
    }

    // add default babel processor for script file if none babel processor existed
    if (file.isScript) {
        addScriptDefaultBabelProcessor(file, buildManager, matchProcessors);
    }

    return matchProcessors;
}

exports.getBuiltinProcessor = function (name, options) {
    let result = BUILTIN_PROCESSORS[name];
    if (!result) {
        return;
    }

    let handler = result.processor;
    if (typeof handler === 'string') {
        handler = customRequire(handler);
    }

    return {
        name,
        handler,
        options,
        rext: result.rext
    };
};

exports.findMatchProcessor = findMatchProcessor;
