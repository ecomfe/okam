/**
 * @file Quick app syntax transformer
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-properties-quote */
/* eslint-disable fecs-min-vars-per-destructure */

const {merge} = require('../../../../util');
const {element, attribute, text} = require('../base');

module.exports = {
    element: merge({}, element, {
        import: false,
        include: {
            transform: require('./include')
        },
        tpl: {
            transform: require('./tpl')
        },
        okamButton: {
            match: 'o-button',
            transform: require('./button')
        },
        text: {
            match(element) {
                return element.children && element.children.length;
            },
            transform: require('./text')
        }
    }),
    attribute: merge({}, attribute, {
        if: {
            transform: require('./condition')
        },
        for: {
            transform: require('./for')
        },
        key: {
            transform: require('./key')
        },
        class: {
            transform: require('./class')
        }
    }),
    text
};
