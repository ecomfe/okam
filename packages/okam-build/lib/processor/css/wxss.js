/**
 * @file Weixin wxss processor
 * @author sparklewhy@gmail.com
 */

'use strict';

const {registerProcessor} = require('../type');
const wxssPlugin = require('../css/plugins/postcss-plugin-wxss');

/**
 * Initialize wx style processor
 *
 * @param {Object=} opts the processor init options
 * @param {Array=} opts.plugins the postcss plugins
 */
function initProcessor(opts) {
    registerProcessor({
        name: 'wxss',
        processor: 'postcss', // using the existed postcss processor
        extnames: ['wxss'],
        rext: 'wxss',
        options: opts || {
            plugins: [
                wxssPlugin
            ]
        }
    });
}

module.exports = initProcessor;
