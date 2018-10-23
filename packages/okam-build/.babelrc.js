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
                [
                    'module-resolver',
                    {
                        alias: {
                            okam: path.join(__dirname, 'lib'),
                            test: path.join(__dirname, 'test/tasks')
                        }
                    }
                ]
            ]
        }
    }
};
