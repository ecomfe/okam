/**
 * @file model-helper
 * @author xiaohong8023@outlook.com
 */

/**
 * 是否已声明某属性
 *
 * @param  {string}  name  name
 * @param  {Array}  attrs attrs
 * @return {boolean}      true or false
 */
function hasAttr(name, attrs) {
    return (attrs[name] || attrs[`:${name}`]);
}

// <input v-model="inputVal" />
// =>
// <input
//      Xinput="__handlerProxy"
//      value="{{inputVal}}" />
//
// <input v-model="inputVal" bindinput="self"/>
// =>
// <input
//      Xinput="__handlerProxy"
//      data-input-proxy="self"
//      value="{{inputVal}}" />
exports.modelTransformer = function (modelMap, attrs, name, tplOpts, opts, element) {
    const {logger, file} = tplOpts;
    let attrMap = modelMap[element.name];

    if (!attrMap) {
        return;
    }

    let {eventName, eventType, attrName, detailName} = attrMap;
    let oldEvent = attrs[eventName];

    if (!oldEvent || (attrs[eventName] === '__handlerProxy')) {
        attrs[eventName] = '__handlerProxy';
    }
    else {
        attrs[`data-${eventType}-proxy`] = oldEvent;
    }

    if (attrName) {
        if (hasAttr(attrName, attrs)) {
            logger.warn(`${file.path} template attribute model is conflicted with ${attrName} on element <${element.name}>`);
        }
        attrs[attrName] = '{{' + attrs[name] + '}}';
    }

    attrs['data-model-expr'] = attrs[name];
    attrs['data-model-detail'] = detailName;
    delete attrs[name];
};
