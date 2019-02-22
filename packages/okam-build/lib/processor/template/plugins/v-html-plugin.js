/**
 * @file v-html
 * @author xiaohong8023@outlook.com
 */

'use strict';

const {createSyntaxPlugin} = require('./helper');

const propName = 'nodes';

function transfromVHtml(attrs, name, tplOpts, opts, element) {
    const {logger, file} = tplOpts;

    let vhtmlValue = attrs['v-html'];
    if (!vhtmlValue) {
        return;
    }

    if (attrs[propName]) {
        logger.warn(
            `${file.path} template attribute 「v-html="${attrs[name]}"」`,
            `is conflicted with 「${propName}」on element <${element.name}>`
        );
    }

    attrs[propName] = `{{${vhtmlValue}}}`;
    element.name = 'rich-text';
    delete attrs['v-html'];
}

module.exports = createSyntaxPlugin({
    attribute: {
        html: {
            match: 'v-html',
            transform: transfromVHtml
        }
    }
});
