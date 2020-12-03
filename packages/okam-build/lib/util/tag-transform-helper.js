/**
 * @file Initialize tag transformation options
 * for config `component.template.transformTags`
 *
 * @author xiaohong8023@outlook.com
 */

'use strict';

/**
 * 将标签转换配置项转为 以 .tag 为 key 的值
 *
 * @param {string} nativeTag key
 * @param {Object|string} transformItem tag or tag options
 * @return {Object}
 */
function normalizeTagTransformInfo(nativeTag, transformItem) {
    if (typeof transformItem === 'string') {
        return {
            transformTag: transformItem,
            transformOpts: nativeTag
        };
    }

    let transformOpts = Object.assign({}, transformItem);
    transformOpts.tag = nativeTag;

    return {
        transformTag: transformItem.tag,
        transformOpts
    };
}

/**
 * 将配置项转为 以 tag 为 key 的值
 *
 * @param {Object} tagsConf 需转的 tags 配置项
 * @return {Object}
 *
 * {
 *     view: ['div', 'p'],
 *     navigator: {
 *         tag: 'a',
 *         href: 'url'
 *     },
 *    image: 'img'
 * }
 *
 * return
 *
 * {
 *     div: 'view',
 *     p: 'view',
 *     a: {
 *         tag: 'navigator',
 *         href: 'url'
 *     },
 *     img: 'image'
 * }
 *
 */
module.exports = function reverseTagMap(tagsConf) {
    let result = {};

    Object.keys(tagsConf || {}).forEach(nativeTag => {
        let transformItems = tagsConf[nativeTag];

        if (Array.isArray(transformItems)) {
            transformItems.forEach(transformItem => {
                let kv = normalizeTagTransformInfo(nativeTag, transformItem);
                result[kv.transformTag] = kv.transformOpts;
            });
        }
        else {
            let kv = normalizeTagTransformInfo(nativeTag, transformItems);
            result[kv.transformTag] = kv.transformOpts;
        }
    });

    return result;
};
