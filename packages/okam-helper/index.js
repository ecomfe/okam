/**
 * @file The okam helper entrance
 * @author sparklewhy@gmail.com
 */

'use strict';

module.exports = exports = {
    event: require('./lib/event'),
    file: require('./lib/file'),
    logger: require('./lib/logger'),
    require: require('./lib/require'),
    string: require('./lib/string'),
    Timer: require('./lib/Timer'),
    lang: require('./lib/lang'),
    net: require('./lib/net'),
    os: require('./lib/os'),
    misc: require('./lib/misc'),
    colors: require('chalk')
};
