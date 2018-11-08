/**
 * @file transform event attr
 * @author sharonzd
 * @date 2018/8/7
 */

'use strict';

const {
    EVENT_HANDLE_REGEXP,
    VARIABLE_EVENT,
    NOT_SUPPORT_MODIFIERS
} = require('./constant');

const {toHyphen} = require('../../../../util').string;

/**
 * show warning log when parsing event name
 *
 * @param {string} name     attribute name
 * @param {string} newName  new attribute name
 * @param {Array} eventModifiers     array of event modifier
 * @param {Object} attrs     all attributes
 * @param {Object} tplOpts  template options
 */
function showEventNameLog(name, newName, eventModifiers, attrs, tplOpts) {
    let {logger, file, appType} = tplOpts;

    NOT_SUPPORT_MODIFIERS.forEach(item => {
        if (eventModifiers.includes(item)) {
            logger.warn(
                `${file.path} template event attribute ${name}`,
                `is not support with ${item} modifier in ${appType} env`
            );
        }
    });

    if (attrs.hasOwnProperty(newName)) {
        logger.warn(`${file.path} template attribute ${name} is conflicted with ${newName}`);
    }
}

/**
 * parse handlerString to function name and function arguments，replace $event
 * 解析函数名及参数
 *
 * eg:
 * <view @click="handleClick($event, '$event')"></view>
 * 会被解析为
 * <view bindtap="__handlerProxy"
 *       data-tap-event-proxy="handleClick"
 *       data-tap-arguments-proxy="{{['u2mirq0709_$event', '$event'}}"
 *       data-tap-event-object-alias="u2mirq0709_$event"></view>
 *
 * 其中$event加上随机数前缀的原因是：
 * 如果未对$event做转换，即<view data-tap-arguments-proxy="{{[$event, '$event'}}"></view>，那么模板被渲染时，会因为找不到对应的变量$event而报错。
 * 因此需要将$event转换为字符串，但是为了避免用户也传递了字符串'$event'导致__handleProxy误解析，所以加上前缀以区分。
 * 同时，由于加任何前缀，都有可能碰上用户巧合传递了同样的字符串，避免传参重复。所以用随机数作前缀（取到随机数后还会判断是否在参数列表中，在的话重取）。
 *
 * @param {string} handlerString   the whole string
 * @return {Object}
 *      handlerName: function name,
 *      handlerArgs: function arguments
 *      eventObjectAlias: the event object alias
 */
function parseHandlerByREGEXP(handlerString) {
    // match handlerName and handle arguments
    const matchArray = handlerString.match(EVENT_HANDLE_REGEXP);
    const handlerName = matchArray && matchArray[1] || '';
    let handlerArgs = matchArray && matchArray[2] || '';
    let eventObjectAlias = '';

    // when there are arguments in function, use __handlerProxy(okam-core/base/component) to handle arguments
    if (handlerArgs && handlerArgs.length > 0) {
        // 避免相邻$event不能被正确的替换e.g. "$event,$event"
        if (handlerArgs.includes(',$event')) {
            handlerArgs = handlerArgs.replace(/,\$event/g, ', $event');
        }

        const pseudoArgsArray = handlerArgs.replace(/\s*/g, '').split(',');
        // transform $event to 'eventObjectAlias', for handleProxy passing on the event Object
        if (pseudoArgsArray.includes('$event')) {
            eventObjectAlias = `${getRandomStringNotIn(handlerArgs)}_$event`;
            handlerArgs = ` ${handlerArgs} `.replace(VARIABLE_EVENT, `$1'${eventObjectAlias}'$2`).trim();
        }
    }
    return {
        handlerName,
        handlerArgs,
        eventObjectAlias
    };
}

/**
 * get a random string which is not in the string
 *
 * @param {string} string the parameter string
 * @return {string} the random string
 */
function getRandomStringNotIn(string) {
    const randomString = Math.random().toString(36).substr(2);
    if (string.indexOf(randomString) === -1) {
        return randomString;
    }
    return getRandomStringNotIn(string);
}

// 1. 使用正则将函数名和函数参数拆分开
// 2. 给事件绑定事件代理函数__handlerProxy
// 3. 将原函数名handleClick保存在data-tap-event-proxy中
// 4. 使用正则解析函数参数
// 5. 将函数参数中的event对象($event)转化为字符串标识，并且在代理函数中提取出event对象
module.exports = function (attrs, name, tplOpts, parseEventName) {

    // eventType, like 'tap'
    // eventAttrName, like 'bindtap'
    // eventModifier, like '[once,self]'
    let {eventType, eventAttrName, eventModifiers} = parseEventName(name);

    let handlerString = attrs[name].trim();

    // match handleName and handle arguments
    let {
        handlerName = handlerString,
        handlerArgs,
        eventObjectAlias
    } = parseHandlerByREGEXP(handlerString);

    showEventNameLog(name, eventAttrName, eventModifiers, attrs, tplOpts);

    // use __handlerProxy(in okam-core/base/component) to agent the event handler
    attrs[eventAttrName] = '__handlerProxy';

    eventType = toHyphen(eventType); // covert the camel case to dash-style

    // save the real event handler
    attrs[`data-${eventType}-event-proxy`] = handlerName;

    // save all arguments in dataSet
    if (handlerArgs && handlerArgs.length > 0) {
        attrs[`data-${eventType}-arguments-proxy`] = `{{[${handlerArgs}]}}`;

        if (eventObjectAlias) {
            attrs[`data-${eventType}-event-object-alias`] = eventObjectAlias;
        }
    }

    if (eventModifiers.includes('self')) {
        attrs[`data-${eventType}-modifier-self`] = true;
    }

    delete attrs[name];
};
