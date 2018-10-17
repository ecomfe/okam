/**
 * @file Babel config
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');

module.exports = {
    env: {
        development: {
            plugins: [
                '@babel/plugin-transform-modules-commonjs',
                'babel-plugin-espower',
                'babel-plugin-empower-assert'
            ]
        }
    }
};
