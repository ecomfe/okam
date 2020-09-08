/**
 * @file Babel config
 * @author congpeisen <congpeisen@baidu.com>
 */

'use strict';

const path = require('path');

module.exports = {
    presets: ['@babel/preset-env'],
    env: {
        development: {
            plugins: [
                [
                    'module-resolver',
                    {
                        alias: {
                            test: path.join(__dirname, 'test/tasks'),
                            api: path.join(__dirname, 'src')
                        }
                    }
                ]
            ]
        }
    }
};
