/**
 * @file Execute h5 webpack compile
 * @author xxx
 */

'use strict';

const path = require('path');
const runH5Compile = require('okam-build-h5');

const isDev = true;
runH5Compile(isDev, {
    webpack: Object.assign({
        devServer: {
            port: 9090,
            disableHostCheck: true
        }
    }, require('../h5.config').webpack),
    root: path.join(__dirname, '../..'),
    sourceDir: path.join(__dirname, '../../h5_dist'),
    homePath: '/pages/home/index',
}).catch(ex => console.error(ex));
