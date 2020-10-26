/**
 * @file Babel config
 * @author congpeisen <congpeisen@baidu.com>
 */

'use strict';

const path = require('path');

module.exports = {
    env: {
        development: {
            plugins: [
                '@babel/plugin-transform-modules-commonjs',
                'babel-plugin-espower',
                'babel-plugin-empower-assert',
                [
                    'module-resolver',
                    {
                        alias: {
                            api: path.join(__dirname, 'src'),
                            test: path.join(__dirname, 'test')
                        }
                    }
                ]
            ]
        }
    }
};
