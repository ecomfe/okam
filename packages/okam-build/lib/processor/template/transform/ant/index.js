/**
 * @file Ant mini program syntax transformer
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-properties-quote */
/* eslint-disable fecs-min-vars-per-destructure */

const {merge} = require('../../../../util');
const {element, attribute, text} = require('../base');

module.exports = {
    element: merge({}, element, {
        tpl: {
            transform: require('./tpl')
        },
        canvas: {
            match: 'canvas',
            transform: require('./canvas')
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
