/**
 * @file Builtin processor helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-prefer-destructure */

const {removeUndefinedAttributes, merge, require: customRequire} = require('../../util');

/**
 * Sort the file default processors by the processor order property.
 *
 * @inner
 * @param {Array.<string>|string} processorNames the processor names.
 * @param {Object} processors the builtin processors, the key is processor name,
 *        the value is the processor config information.
 */
function sortDefaultProcessors(processorNames, processors) {
    if (Array.isArray(processorNames)) {
        processorNames.sort((a, b) => {
            a = processors[a];
            b = processors[b];
            return (a.order || 0) - (b.order || 0);
        });
    }
}

/**
 * Add the file extname associated processors.
 *
 * @inner
 * @param {string|Array.<string>} extnames the file extnames
 * @param {string} processorName the processor name
 * @param {Object} existedMap the existed file extname associated processors map
 */
function addFileExtnameAssociatedProcessor(extnames, processorName, existedMap) {
    if (!extnames) {
        return;
    }

    if (!Array.isArray(extnames)) {
        extnames = [extnames];
    }

    extnames.forEach(k => {
        k = k.toLowerCase();

        let processors = existedMap[k];
        if (Array.isArray(processors)) {
            processors.push(processorName);
        }
        else if (processors) {
            existedMap[k] = [processors, processorName];
        }
        else {
            existedMap[k] = processorName;
        }
    });
}

/**
 * Remove the file extname associated processors.
 *
 * @inner
 * @param {string|Array.<string>} extnames the file extnames
 * @param {string} processorName the processor name
 * @param {Object} existedMap the existed file extname associated processors map
 */
function removeFileExtnameAssociatedProcessor(extnames, processorName, existedMap) {
    if (!extnames) {
        return;
    }

    if (!Array.isArray(extnames)) {
        extnames = [extnames];
    }

    extnames.forEach(k => {
        let currItems = existedMap[k];
        if (Array.isArray(currItems)) {
            let idx = currItems.indexOf(processorName);
            if (idx !== -1) {
                currItems.splice(idx, 1);
                currItems.length === 0 && (existedMap[k] = undefined);
            }
        }
        else if (currItems === processorName) {
            existedMap[k] = undefined;
        }
    });
}

/**
 * Get the map of the file extname with processor name.
 *
 * @inner
 * @param {Object} processors the builtin processors, the key is processor name,
 *        the value is the processor config information.
 * @return {Object}
 */
function getFileExtnameAssociatedProcessor(processors) {
    let result = Object.keys(processors).reduce(
        (lastValue, processorName) => {
            let processor = processors[processorName];
            let extnames = processor.extnames || [];
            if (!Array.isArray(extnames)) {
                extnames = [extnames];
            }
            addFileExtnameAssociatedProcessor(extnames, processorName, lastValue);
            return lastValue;
        },
        {}
    );

    Object.keys(result).forEach(
        k => sortDefaultProcessors(result[k], processors)
    );
    return result;
}

/**
 * Resolve the given processor
 *
 * @inner
 * @param {string|Function} processor the processor to resolve
 * @return {Function}
 */
function resolveProcessor(processor) {
    if (typeof processor === 'string') {
        processor = customRequire(processor);
    }
    else if (!processor) {
        throw 'processor handler is not specified, please make sure your processor name is correct';
    }
    return processor;
}

/**
 * Initialize processor information
 *
 * @inner
 * @param {string} name the processor name
 * @param {Object} info the processor info
 * @param {Object} existedProcessors the existed processors
 * @return {Object}
 */
function initProcessorInfo(name, info, existedProcessors) {
    let processor = info.processor;
    if (!processor) {
        return info;
    }

    if (typeof processor === 'string') {
        // if the processor refer to the existed processor, merge the existed
        // processor info with current processor
        let old = existedProcessors[processor];
        if (old) {
            info.processor = undefined;
            // remove undefined attributes
            info = removeUndefinedAttributes(info);

            let deps = info.deps;
            deps && !Array.isArray(deps) && (deps = [deps]);

            let oldDeps = old.deps;
            oldDeps && !Array.isArray(oldDeps) && (oldDeps = [oldDeps]);

            info = Object.assign({}, old, info);
            info.deps = merge(deps || [], oldDeps || []);

            return Object.assign({refer: processor}, old, info);
        }
    }

    try {
        info.processor = resolveProcessor(processor);
    }
    catch (ex) {
        let msg = `processor \`${name}\` handler \`${processor}\` not `
            + `found: ${ex.message || ex.toString()}`;
        throw new Error(msg);
    }
    return info;
}

/**
 * Override the function value for the given object
 *
 * @param {?Object} curr the current object
 * @param {?Object} old the old object
 * @return {?Object}
 */
function overrideObjectFunctions(curr, old) {
    if (!old) {
        return curr;
    }

    if (!curr && curr !== undefined) {
        return old;
    }

    let result = {};
    Object.keys(curr).forEach(k => {
        let v = curr[k];
        let oldV = old[k];
        if (typeof v === 'function' && typeof oldV === 'function') {
            let currV = v;
            v = function (...args) {
                oldV.apply(this, args);
                currV.apply(this, args);
            };
        }
        result[k] = v;
    });

    return result;
}

/**
 * Override the builtin processor definition
 *
 * @inner
 * @param {Object} existedProcessor the builtin existed processor config
 * @param {Object} extnameProcessorMap the file extname associated processors map
 * @param {Object} opts the override options
 */
function overrideProcessor(existedProcessor, extnameProcessorMap, opts) {
    let oldExtnames;
    let newExtnames;
    Object.keys(opts).forEach(k => {
        let v = opts[k];
        if (!v) {
            return;
        }

        if (k === 'extnames') {
            oldExtnames = existedProcessor[k];
            newExtnames = v;
        }

        if (k === 'hook') {
            v = overrideObjectFunctions(v, existedProcessor[k]);
        }

        existedProcessor[k] = v;
    });

    let processor = opts.processor;
    if (processor) {
        existedProcessor.processor = resolveProcessor(processor);
    }

    let processorName = opts.name;
    removeFileExtnameAssociatedProcessor(
        oldExtnames, processorName, extnameProcessorMap
    );
    addFileExtnameAssociatedProcessor(newExtnames, processorName, extnameProcessorMap);
}

/**
 * Update existed processor processor info. If the processor has been defined,
 * it'll skip the update.
 *
 * @param {Object} existedProcessors the existed processors info
 * @param {string} processorName the processor name to update
 * @param {string} referProcessorName the refer processor
 */
function updateReferProcessorInfo(existedProcessors, processorName, referProcessorName) {
    let currProcessor = existedProcessors[processorName];
    if (!currProcessor || currProcessor.processor) {
        return;
    }

    let referProcessorInfo = existedProcessors[referProcessorName];
    if (!referProcessorInfo) {
        return;
    }

    let deps = referProcessorInfo.deps;
    deps && !Array.isArray(deps) && (deps = [deps]);

    let oldDeps = currProcessor.deps;
    oldDeps && !Array.isArray(oldDeps) && (oldDeps = [oldDeps]);

    let old = Object.assign({}, currProcessor);
    Object.assign(currProcessor, referProcessorInfo, old, {
        refer: referProcessorName,
        deps: merge(deps || [], oldDeps || []),
        processor: referProcessorInfo.processor
    });
}

/**
 * Register the custom processor
 *
 * @param {Object} existedProcessors the existed processors, the key is processor name,
 *        the value is the processor config information.
 * @param {Object} extnameProcessorMap the file extname associated processors map
 * @param {Object} opts the processor config
 */
function registerProcessor(existedProcessors, extnameProcessorMap, opts) {
    let {name, processor, deps, rext, extnames, options, order, hook} = opts;
    if (!name) {
        throw new Error('missing processor name to register');
    }

    if (existedProcessors.hasOwnProperty(name)) {
        // override existed processor definition
        overrideProcessor(
            existedProcessors[name], extnameProcessorMap, opts
        );
    }
    else {
        existedProcessors[name] = initProcessorInfo(name, {
            processor,
            deps,
            rext,
            extnames,
            options,
            order,
            hook
        }, existedProcessors);
        addFileExtnameAssociatedProcessor(extnames, name, extnameProcessorMap);
    }

    // resort the file extname associated processors execution order
    if (extnames && !Array.isArray(extnames)) {
        extnames = [extnames];
    }
    extnames && extnames.forEach(
        k => sortDefaultProcessors(extnameProcessorMap[k], existedProcessors)
    );
}

module.exports = exports = {
    getFileExtnameAssociatedProcessor,
    registerProcessor,
    updateReferProcessorInfo
};
