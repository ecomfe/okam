/**
 * @file Make the page component support behavior/mixin
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
import {initMixinsOption, mixin} from './helper';
import strategy from './strategy';

function initBehaviors(component, isPage) {
    let behaviors = component.mixins;
    if (!behaviors) {
        return;
    }

    if (isPage || !strategy.useNativeBehavior) {
        mixin(component, behaviors);
    }
    else {
        let extendMixin = {};
        initMixinsOption(component, extendMixin);
        mixin(component, [extendMixin]);
    }
}

/**
 * Initialize the component relations
 *
 * @inner
 * @param {Object} component the component info
 * @param {boolean} isPage whether is the page component
 */
function initRelations(component, isPage) {
    let relations = component.relations;
    if (!relations || isPage) {
        // relations only support component, page is not supported
        return;
    }

    // normalize relation `target` information
    Object.keys(relations).forEach(k => {
        let item = relations[k];
        let {target} = item;
        if (typeof target === 'function') {
            target = target();
            item.target = target.behavior;
        }
    });
}

export default {

    /**
     * Initialize the behavior plugin
     *
     * @param {Object} options the plugin options
     * @param {boolean=} useNativeBehavior whether using native behavior,
     *        by default true if the runtime support the native behavior.
     * @param {Object=} mixinStrategy the custom mixin strategy
     */
    init({useNativeBehavior, mixinStrategy} = {}) {
        if (useNativeBehavior != null) {
            strategy.useNativeBehavior = !!useNativeBehavior;
        }

        if (mixinStrategy && typeof mixinStrategy === 'object') {
            strategy.mixin = Object.assign(strategy.mixin, mixinStrategy);
        }
    },

    component: {

        /**
         * The instance initialize before the instance is created.
         *
         * @private
         * @param {boolean} isPage whether is page component initialization
         */
        $init(isPage) {
            initBehaviors(this, isPage);
            initRelations(this, isPage);
        }
    }
};
