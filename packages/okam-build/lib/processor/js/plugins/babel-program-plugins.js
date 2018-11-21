/**
 * @file The babel plugins to transform mini program
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const getMiniProgramVisitor = require('../transform/visitor');

module.exports = exports = {

    /**
     * Resolve npm module depenence and rewrite the module id
     *
     * @type {Function}
     */
    resolveDep: require('../transform/dep'),

    /**
     * Transform app babel plugin
     *
     * @type {Function}
     */
    app: getMiniProgramVisitor({
        baseName: 'App',
        isApp: true
    }),

    /**
     * Transform page babel plugin
     *
     * @type {Function}
     */
    page: getMiniProgramVisitor({
        baseName: 'Page',
        isPage: true
    }),

    /**
     * Transform component babel plugin
     *
     * @type {Function}
     */
    component: getMiniProgramVisitor({
        baseName: 'Component',
        isComponent: true
    }),

    /**
     * Transform behavior babel plugin
     *
     * @type {Function}
     */
    behavior: getMiniProgramVisitor({
        baseName: 'Behavior',
        extensionName: 'behavior',
        isBehavior: true,
        isExtension: true,
        needExport: true
    })
};
