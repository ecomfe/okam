/**
 * @file entrance
 * @author wuhuiyao <sparklewhy@gmail.com>
 */

'use strict';

module.exports = exports = {
    event: require('./lib/event'),
    file: require('./lib/file'),
    logger: require('./lib/logger'),
    require: require('./lib/require'),
    string: require('./lib/string'),
    Timer: require('./lib/Timer'),
    helper: require('./lib/helper'),
    colors: require('chalk')
};
