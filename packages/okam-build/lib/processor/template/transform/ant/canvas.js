/**
 * @file Transform ant canvas element
 * @author sparklewhy@gmail.com
 */

'use strict';

module.exports = function (element, tplOpts, opts) {
    let {logger} = tplOpts;
    let {attribs: attrs} = element;
    let canvasId = attrs && attrs['canvas-id'];
    if (canvasId) {
        let id = attrs.id;
        if (id && id !== canvasId) {
            logger.warn(
                'canvas element `id` attribute value should be the same as the',
                '`canvas-id`, because in ant app using `id`, in weixin app',
                'using `canvas-id`'
            );
        }
        else if (!id) {
            attrs.id = canvasId;
        }

        delete attrs['canvas-id'];
    }
};
