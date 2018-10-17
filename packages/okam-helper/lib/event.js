/**
 * @file event utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * Handle the event proxy
 *
 * @inner
 * @param {EventEmitter} source the event trigger source
 * @param {EventEmitter} target the proxy target
 * @param {string} eventName the proxy event name
 * @param {Object=} options the proxy options
 * @param {string|Function=} options.newEventName the new event name to trigger
 *        or default event handler
 * @param {boolean=} options.prependSourceArg whether prepend the original event
 *         trigger to event handler argument list. By default, false.
 */
function handleProxyEvent(source, target, eventName, options) {
    let {newEventName, prependSourceArg} = options || {};

    source.on(eventName, function (...args) {
        prependSourceArg && args.unshift(source);

        if (typeof newEventName === 'function') {
            newEventName.apply(target, args);
        }
        else {
            newEventName || (newEventName = eventName);
            args.unshift(newEventName);
            target.emit.apply(target, args);
        }
    });
}

/**
 * Proxy the original event emitter events to the target event emitter.
 *
 * @param  {EventEmitter} source the proxy original event trigger
 * @param  {EventEmitter} target the proxy target event emitter
 * @param  {string|Array.<string>|Object} events the proxy events
 * @param {boolean=} prependSourceArg whether prepend the original event trigger
 *        to event handler argument list. By default, false.
 * @example
 *     // proxy change event
 *     proxyEvents(source, target, 'change');
 *
 *     // proxy multiple events
 *     proxyEvents(source, target, ['change', 'add']);
 *
 *     // custom proxy options using object:
 *     // the key is the proxy event, the value is the new event name
 *     // to trigger or the event handler. If the new event name is empty, it'll
 *     // using the original event name to trigger
 *     proxyEvents(source, target, { change: 'myChange', add: '', delete() {} });
 */
exports.proxyEvents = function (source, target, events, prependSourceArg) {
    let isArr = Array.isArray(events);
    if (!isArr && typeof events === 'string') {
        events = [
            events
        ];
        isArr = true;
    }

    let eventName;
    /* eslint-disable fecs-no-forin-array */
    for (let k in events) {
        if (events.hasOwnProperty(k)) {
            eventName = isArr ? events[k] : k;
            handleProxyEvent(source, target, eventName, {
                newEventName: isArr ? '' : events[k],
                prependSourceArg: prependSourceArg
            });
        }
    }
};
