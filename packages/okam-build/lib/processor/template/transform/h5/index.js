/**
 * @file H5 app syntax transformer
 * @author sparklewhy@gmail.com
 */

'use strict';

const {CONDITION_DIRECTIVES} = require('../base/constant');

module.exports = {
    element: {
        include: {
            match: 'include',
            transform: require('../common/include')
        },
        tpl: {
            match: 'tpl',
            transform: require('../common/tpl')
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
