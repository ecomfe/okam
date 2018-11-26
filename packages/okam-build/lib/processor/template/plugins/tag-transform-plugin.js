/**
 * @file Transform tag A to tag B plugin
 * @author sharonzd sparklewhy@gmail.com xiaohong8023@outlook.com
 * @date 2018/11/26
 */

'use strict';

module.exports = {
    tag(node, tplOpts) {
        const tagName = node.name.toLowerCase();
        const {logger, config} = tplOpts;
        const onTag = config.onTag;
        const tagConfig = (config.template && config.template.transformTags) || {};
        const tagAttrs = tagConfig[tagName];

        // do nothing if the tag is not in tagMap
        if (!tagAttrs) {
            return;
        }

        // tag to mini program tag
        if (typeof tagAttrs === 'string') {
            let oldTag = node.name;
            node.name = tagAttrs;
            onTag && onTag(tagAttrs, oldTag);
            return;
        }

        let attrs = node.attribs || {};

        // transform special tag, such as a->navigator
        // a: {
        //     tag: 'navigator',
        //     href: 'url'
        // };
        Object.keys(tagAttrs).forEach(key => {
            const attrVal = tagAttrs[key];

            if (typeof attrVal !== 'string') {
                logger.error('tag props must be string');
                return;
            }

            if (key === 'tag') {
                // tag to mini program tag
                let oldTag = node.name;
                node.name = attrVal;
                onTag && onTag(attrVal, oldTag);
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
