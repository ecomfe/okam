/**
 * @file wx to swan
 * @author xiaohong8023@outlook.com
 */

'use strict';

const wx2swanMap = {
    wxml: {
        processor: require('./wxmlTransform'),
        rext: 'swan'
    },
    wxss: {
        processor: null,
        rext: 'css'
    },
    js: {
        processor: require('./apiTransform')
    }
};

module.exports = function (file, options) {
    const transformDetail = wx2swanMap[file.extname];
    let result = {
        content: file.content
    };

    if (transformDetail) {
        transformDetail.rext && (file.rext = transformDetail.rext);
        transformDetail.processor && (result = transformDetail.processor(file, options));
    }

    return result;
};
