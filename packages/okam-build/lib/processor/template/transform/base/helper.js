/**
 * @file Template transformation helper
 * @author sparklewhy@gmail.com
 */

'use strict';

exports.removeEmptyTextNode = function (...nodes) {
    nodes.forEach(item => {
        if (item && item.type === 'text' && !item.data.trim().length) {
            item.removed = true;
        }
    });
};
