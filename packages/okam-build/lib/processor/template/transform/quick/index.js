/**
 * @file Quick app syntax transformer
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-properties-quote */
/* eslint-disable fecs-min-vars-per-destructure */

const {merge} = require('../../../../util');
const {element, attribute} = require('../base');

module.exports = {
    element: merge({}, element, {
        import: false,
        include: {
            transform: require('./include')
        },
        tpl: {
            transform: require('./tpl')
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
        }
    })
};
