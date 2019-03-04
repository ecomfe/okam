/**
 * @file H5 app syntax transformer
 * @author sparklewhy@gmail.com
 */

'use strict';

const {CONDITION_DIRECTIVES, ENV_ELEMENT_REGEXP} = require('../base/constant');
const transformEnvElement = require('../base/env');

module.exports = {
    element: {
        include: {
            match: 'include',
            transform: require('../common/include')
        },
        tpl: {
            match: 'tpl',
            transform: require('../common/tpl')
        },
        env: {
            match(element) {
                return ENV_ELEMENT_REGEXP.test(element.name);
            },
            transform: transformEnvElement
        }
    },
    attribute: {
        if: {
            match(name) {
                return CONDITION_DIRECTIVES.includes(name);
            },
            transform: require('./condition')
        },
        for: {
            match: 'for',
            transform: require('./for')
        }
    }
};
