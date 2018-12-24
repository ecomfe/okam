/**
 * @file support v- prefix
 * @author xiaohong8023@outlook.com
 */

'use strict';


const DIRECTIVES_MAP = {
    'v-if': 'if',
    'v-else-if': 'elif',
    'v-elif': 'elif',
    'v-else': 'else',
    'v-for': 'for',
    // okam 暂不支持这个 转成 if
    'v-show': 'if'
    // 暂不支持
    // 'v-html': 'html'
};

const DIRECTIVES_REGEXP = {
    'v-on:': {
        match: /^v-on:/,
        replace: '@'
    },
    'v-bind': {
        match: /^v-bind:/,
        replace: ''
    }
};

function getNewAttrKey(attr) {

    let newAttr = DIRECTIVES_MAP[attr];

    if (typeof newAttr === 'string') {
        return newAttr;
    }

    Object.keys(DIRECTIVES_REGEXP).some(key => {
        let matchConf = DIRECTIVES_REGEXP[key];

        // default RegExp
        let match = attr.match(matchConf.match) || '';

        if (!match) {
            return false;
        }

        newAttr = attr.replace(key, matchConf.replace);
        return true;
    });

    return newAttr;
}

module.exports = {
    tag(node, tplOpts) {
        const {logger, file} = tplOpts;
        let attrs = node.attribs || {};

        Object.keys(attrs).forEach(key => {

            let newAttr = getNewAttrKey(key);
            if (attrs.hasOwnProperty(newAttr)) {
                logger.warn(`${file.path} template attribute ${key} is conflicted with ${newAttr}`);
            }

            if (!newAttr) {
                return;
            }

            attrs[newAttr] = attrs[key];
            delete attrs[key];
        });
    }
};
