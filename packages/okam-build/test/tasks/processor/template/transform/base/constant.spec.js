/**
 * @file test regexp in constant
 * @author sharonzd
 */

'use strict';

const assert = require('assert');
const {
    DATA_BIND_REGEXP,
    BRACKET_REGEXP,
    EVENT_REGEXP,
    EVENT_HANDLE_REGEXP,
    VARIABLE_EVENT
} = require('okam/processor/template/transform/base/constant');

describe('regexp', function () {
    it('should match data-binding identifier', function () {
        const result = ':xxx'.match(DATA_BIND_REGEXP);
        assert(result[0] === ':');
    });

    it('should match bracket', function () {
        const result = 'for=(xx,xx)xx'.match(BRACKET_REGEXP);
        assert(result[0] === '(' && result[1] === ')');
    });

    it('should match event identifier', function () {
        const result = '@xxx'.match(EVENT_REGEXP);
        assert(result[0] === '@');
    });

    it('should match event handler', function () {
        const result = 'handleClick  ((a ? 1 : 0), \'a & b\', b, {a:1,b:2})'.match(EVENT_HANDLE_REGEXP);
        assert(result[1] === 'handleClick' && result[2] === '(a ? 1 : 0), \'a & b\', b, {a:1,b:2}');
    });

    it('should match variable $event but not string "$event" in arguments string', function () {
        const result = parseHandlerArgs('handleClick( $event, \'$event\', $event,\'$event\',$event )', 'hello_');
        const result2 = parseHandlerArgs('handleClick($event)', 'bye_');

        assert(result === '\'hello_$event\', \'$event\', \'hello_$event\',\'$event\',\'hello_$event\'');
        assert(result2 === '\'bye_$event\'');
    });
});


function parseHandlerArgs(handlerString, $eventPrefix = '') {
    // match handlerName and handle arguments
    const matchArray = handlerString.match(EVENT_HANDLE_REGEXP);
    let handlerArgs = matchArray && matchArray[2] || '';

    // when there are arguments in function, use __handlerProxy(okam-core/base/component) to handle arguments
    if (handlerArgs && handlerArgs.length > 0) {
        // transform $event to '$event', for handleProxy passing on the event Object
        const pseudoArgsArray = handlerArgs.replace(/\s*/g, '').split(',');
        if (pseudoArgsArray.includes('$event')) {

            // transform $event to 'prefix_$event', for handleProxy passing on the event Object
            handlerArgs = ` ${handlerArgs} `.replace(VARIABLE_EVENT, `$1'${$eventPrefix}$event'$2`).trim();
        }
    }
    return handlerArgs;
}
