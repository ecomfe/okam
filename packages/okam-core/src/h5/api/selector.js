/**
 * @file CreateSelectorQuery API
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global window:false */
/* global document:false */

import {getWindowScroll} from '../util/dom';
import {isSimpleType} from '../util/lang';

/**
 * The not supported property name list in properties query field
 *
 * @const
 * @type {Array.<string>}
 */
const NOT_SUPPORT_PROPS = ['id', 'class', 'style'];

/**
 * The validated fields to query
 *
 * @const
 * @type {Object}
 */
const VALIDATED_FIELDS = {
    id: true,

    /**
     * Query the element data set info
     *
     * @param {HTMLElement} elem the element to query
     * @return {Object}
     */
    dataset(elem) {
        return Object.assign({}, elem.dataset);
    },

    /**
     * 返回节点布局位置（left right top bottom）
     *
     * @param {HTMLElement} element the element to query
     * @param {boolean} isViewport whether query viewport
     * @return {Object}
     */
    rect(element, isViewport) {
        if (isViewport) {
            return {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
        }

        let {left, right, top, bottom} = element.getBoundingClientRect();
        return {left, right, top, bottom};
    },

    /**
     * 节点尺寸（width height）
     *
     * @param {HTMLElement} element the element to query
     * @param {boolean} isViewport whether query viewport
     * @return {Object}
     */
    size(element, isViewport) {
        if (isViewport) {
            let docElem = document.documentElement;
            return {
                width: docElem.clientWidth,
                height: docElem.clientHeight
            };
        }

        let {width, height} = element.getBoundingClientRect();
        return {
            width,
            height
        };
    },

    /**
     * 返回节点的 scrollLeft scrollTop，节点必须是 scroll-view 或者 viewport
     *
     * @param {HTMLElement} elem the element to query
     * @param {boolean} isViewport whether query viewport
     * @return {Object}
     */
    scrollOffset(elem, isViewport) {
        if (isViewport) {
            return getWindowScroll();
        }

        return {
            scrollLeft: elem.scrollLeft,
            scrollTop: elem.scrollTop
        };
    },

    /**
     * 指定属性名列表，返回节点对应属性名的当前属性值（只能获得组件文档中标注的常规属性值，
     * id class style 和事件绑定的属性值不可获取）
     *
     * @param {HTMLElement} elem the element to query
     * @param {Array.<string>} props the property list to query
     * @return {Object}
     */
    properties(elem, props) {
        let result = {};
        if (props.length) {
            props.forEach(p => {
                if (NOT_SUPPORT_PROPS.includes(p)) {
                    return;
                }

                let value = elem[p];
                if (value == null || !isSimpleType(value)) {
                    value = elem.getAttribute(p);
                }

                if (value != null) {
                    result[p] = value;
                }
            });
        }
        return result;
    },

    /**
     * 指定样式名列表，返回节点对应样式名的当前值，computedStyle 的优先级高于 size，
     * 当同时在 computedStyle 里指定了width/height 和 传入了 size: true，
     * 则优先返回 computedStyle 获取到的 width/height。
     *
     * @param {HTMLElement} elem the element to query
     * @param {Array.<string>} props the computed property list to query
     * @return {Object}
     */
    computedStyle(elem, props) {
        let result = {};
        if (props.length) {
            let style = window.getComputedStyle(elem);
            props.forEach(key => {
                let value = style.getPropertyValue(key);
                if (value || (value !== '' && value != null)) {
                    result[key] = value;
                }
            });
        }
        return result;
    },

    /**
     * 是否返回节点对应的 Context 对象
     *
     * @param {HTMLElement} elem the element to query
     * @return {Object}
     */
    context(elem) {
        console.warn('currently, the context field is not supported in h5 app');
        return {};
    }
};

/**
 * Query matched elements
 *
 * @inner
 * @param {boolean} isMatchRootElement whether is root element matched the selector
 * @param {HTMLElement} element the root element
 * @param {string} selector the selector to query
 * @param {boolean} selectAll whether is select all
 * @return {Array.<HTMLElement>|?HTMLElement}
 */
function queryMatchElements(isMatchRootElement, element, selector, selectAll) {
    let findElemList;
    if (selectAll) {
        findElemList = element.querySelectorAll(selector);
        isMatchRootElement && findElemList.unshift(element);
    }
    else {
        findElemList = isMatchRootElement ? element : element.querySelector(selector);
    }
    return findElemList;
}

/**
 * Check the given element whether matched the given selector
 *
 * @inner
 * @param {HTMLElement} element the root element
 * @param {string} selector the selector to query
 * @return {boolean}
 */
function checkElementMatchSelector(element, selector) {
    let parent = element.parentElement || document;
    let nodeList = parent.querySelectorAll(selector);
    for (let i = 0, len = nodeList.length; i < len; i++) {
        let item = nodeList[i];
        if (item === element) {
            return true;
        }
    }
    return false;
}

/**
 * Query the element field values
 *
 * @inner
 * @param {HTMLElement} element the root element
 * @param {Object} fields the fields to query
 * @param {string} selector the element selector
 * @return {Object}
 */
function queryElementFields(element, fields, selector) {
    let result = {};
    Object.keys(fields).forEach(k => {
        let info = fields[k];
        if (typeof info === 'function') {
            Object.assign(result, info(element));
        }
        else {
            result[k] = element[k];
        }
    });
    return result;
}

/**
 * Query elements
 *
 * @inner
 * @param {boolean} selectViewport whether select viewport
 * @param {Object} options the query options
 * @param {Function} done the query callback
 * @return {*}
 */
function queryElements(selectViewport, options, done) {
    let {selector, selectAll, component} = options;
    if (selectViewport) {
        return done(document.documentElement);
    }

    // remove the `>>>` selector which is not supported in h5 app
    if (typeof selector === 'string') {
        selector = selector.replace('>>>', '');
    }

    let element;
    let isMatchRootElement = false;
    if (component) {
        element = component.$el;
        if (!element) {
            component.$nextTick(() => {
                element = component.$el;
                isMatchRootElement = checkElementMatchSelector(element, selector);
                let result = queryMatchElements(
                    isMatchRootElement, element, selector, selectAll
                );
                done(result);
            });
            return;
        }

        isMatchRootElement = checkElementMatchSelector(element, selector);
    }

    done(queryMatchElements(
        isMatchRootElement, element, selector, selectAll
    ));
}

/**
 * Execute the element query
 *
 * @inner
 * @param {Object} options the query options
 * @return {Promise}
 */
function execQuery(options) {
    let {selector, selectAll, fields, callback} = options;
    let selectViewport = selector === 'html';
    return new Promise((resolve, reject) => {
        queryElements(selectViewport, options, elements => {
            let result;
            if (selectAll) {
                result = elements.map(
                    item => queryElementFields(item, fields, selector)
                );
            }
            else {
                result = queryElementFields(elements, fields, selector);
            }

            callback && callback(result);
            resolve(result);
        });
    });
}

/**
 * Nodes ref
 *
 * @class NodesRef
 */
class NodesRef {
    constructor(query, selector, isSelectAll) {
        this._query = query;
        this._selector = selector;
        this._isSelectAll = isSelectAll;
        this._component = query._component;
    }

    fields(fieldInfo) {
        let queryFields = {};
        Object.keys(fieldInfo).forEach(k => {
            let type = VALIDATED_FIELDS[k];
            if (type) {
                queryFields[k] = fieldInfo[k];
            }
            else {
                console.warn('unknown query field', k);
            }
        });

        this._query._addQuery({
            selector: this._selector,
            selectAll: this._isSelectAll,
            component: this._component,
            fields: queryFields
        });
        return this._query;
    }

    boundingClientRect(callback) {
        this._query._addQuery({
            selector: this._selector,
            selectAll: this._isSelectAll,
            component: this._component,
            fields: {
                id: true,
                dataset: true,
                left: true,
                right: true,
                top: true,
                bottom: true,
                width: true,
                height: true
            },
            callback
        });

        return this._query;
    }

    scrollOffset(callback) {
        this._query._addQuery({
            selector: this._selector,
            selectAll: this._isSelectAll,
            component: this._component,
            fields: {
                id: true,
                dataset: true,
                scrollLeft: true,
                scrollTop: true
            },
            callback
        });
        return this._query;
    }

    context(callback) {
        console.warn('currently, the context api is not supported in h5 app');
        return this._query;
    }
}

/**
 * Selector Query
 *
 * @class SelectorQuery
 */
class SelectorQuery {

    constructor() {
        this._queryQueues = [];
        this._component = null;
    }

    in(component) {
        this._component = component;
        return this;
    }

    select(selector) {
        return new NodesRef(this, selector, false);
    }

    selectAll(selector) {
        return new NodesRef(this, selector, true);
    }

    selectViewport() {
        return new NodesRef(this, 'html', false);
    }

    exec(callback) {
        let promiseList = [];
        this._queryQueues.forEach(item => promiseList.push(execQuery(item)));
        Promise.all(promiseList).then(callback);
    }

    _addQuery(opts) {
        this._queryQueues.push(opts);
    }
}

export default {

    /**
     * Create selector query
     *
     * @return {SelectorQuery}
     */
    createSelectorQuery() {
        return new SelectorQuery();
    }
};
