/**
 * @file support v- prefix
 * @author xiaohong8023@outlook.com
 */

'use strict';

/**
 * 直接替换的属性
 *
 * @type {Object}
 * @const
 */
const DIRECTIVES_MAP = {
    'v-if': 'if',
    'v-else-if': 'elif',
    'v-elif': 'elif',
    'v-else': 'else',
    'v-for': 'for',
    'v-model': 'v-model'
};

/**
 * 正则匹配替换
 *
 * @type {Object}
 * @const
 */
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

/**
 * 不支持的指令
 *
 * @type {Object}
 * @const
 */
const DIRECTIVES_NOT_SUPPORT = [
    'v-text',
    'v-show', 'v-pre',
    'v-cloak', 'v-once'
];

/**
 * 通过 framework 选择性支持的指令
 *
 * @type {Object}
 * @const
 */
const DIRECTIVES_FRAMEWORK_SUPPORT = {
    'v-model': 'model',
    'v-html': 'vhtml'
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
        const {logger, file, config} = tplOpts;
        const framework = config.framework || [];
        const attrs = node.attribs || {};

        Object.keys(attrs).forEach(key => {
            if (DIRECTIVES_NOT_SUPPORT.indexOf(key) >= 0) {
                logger.error(`${file.path} template attribute ${key} not support`);
                return;
            }

            let supportByFramework = DIRECTIVES_FRAMEWORK_SUPPORT[key];
            if (supportByFramework && framework.indexOf(supportByFramework) < 0) {
                logger.error(`${file.path} template attribute ${key} not support`);
                logger.warn(
                    `you can try to add '${supportByFramework}' in build`,
                    'config `framework` to enable'
                );
                return;
            }

            let newAttr = getNewAttrKey(key);
            if (!newAttr || key === newAttr) {
                return;
            }

            if (attrs.hasOwnProperty(newAttr)) {
                logger.warn(`${file.path} template attribute ${key} is conflicted with ${newAttr}`);
            }

            attrs[newAttr] = attrs[key];
            delete attrs[key];
        });
    }
};
