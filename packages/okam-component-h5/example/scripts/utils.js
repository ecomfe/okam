/**
 * @file webpack config util
 * @author xxx
 */

'use strict';

const path = require('path');

module.exports = {
    resolve: function(dir) {
        return path.join(__dirname, '..', dir);
    },

    assetsPath: function(assetPath) {
        const assetsSubDirectory = 'static';
        return path.posix.join(assetsSubDirectory, assetPath);
    }
};
