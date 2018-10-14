/**
 * @file Transform HTML tag to mini program tag plugin
 * @author sharonzd sparklewhy@gmail.com
 * @date 2018/8/13
 */

'use strict';

module.exports = {
    tag(node, tplOpts) {
        const tagName = node.name.toLowerCase();
        const {logger, config} = tplOpts;
        const tagConfig = (config.template && config.template.transformTags) || {};
        const tagAttrs = tagConfig[tagName];

        // do nothing if the tag is not in tagMap
        if (!tagAttrs) {
            return;
        }

        // tag to mini program tag
        if (typeof tagAttrs === 'string') {
            node.name = tagAttrs;
            return;
        }

        let attrs = node.attribs || {};

        // transform special tag, such as a->navigator
        //
        // eg:
        // 用户配置项：
        // navigator: {
        //     tag: 'a',
        //     href: 'url'
        // },
        //
        // 被转化后的config对象
        // a: {
        //     tag: 'navigator',
        //     href: 'url'
        // };
        //
        // 因此：tagAttrs为{tag: 'navigator', href: 'url'}
        Object.keys(tagAttrs).forEach(key => {
            const attrVal = tagAttrs[key];

            if (typeof attrVal !== 'string') {
                logger.error('tag props must be string');
                return;
            }

            if (key === 'tag') {
                // tag to mini program tag
                node.name = attrVal;
            }
            else if (key === 'class') {
                // add extra class name
                attrs.class = attrs.class
                    ? `${attrVal} ${attrs.class}`
                    : attrVal;
            }
            else if (attrs[key]) {
                // transform props
                // eg: <a href='xxx'> to <navigator url='xxx'>
                //    attrs['url'] = attrs['href']
                attrs[attrVal] = attrs[key];
                delete attrs[key];
            }
        });
    }
};
