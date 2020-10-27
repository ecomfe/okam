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
                'babel-plugin-empower-assert',
                [
                    'module-resolver',
                    {
                        alias: {
                            core: path.join(__dirname, 'src'),
                            test: path.join(__dirname, 'test'),
                            '@system.app': path.join(__dirname, 'test/fixtures/quick/app'),
                            '@system.prompt': path.join(__dirname, 'test/fixtures/quick/prompt'),
                            '@system.router': path.join(__dirname, 'test/fixtures/quick/router'),
                            '@system.fetch': path.join(__dirname, 'test/fixtures/quick/fetch'),
                            '@system.device': path.join(__dirname, 'test/fixtures/quick/device')
                        }
                    }
                ]
            ]
        }
    }
};
