/**
 * @file Make the page component support behavior/mixin
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
import {initBehaviors} from './helper';
import {getStrategyConfig} from './strategy';
import {normalizeBehaviorAttribute} from './Behavior';

let strategyConf;

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
     */
    init(options) {
        strategyConf = getStrategyConfig(options);
    },

    component: {

        /**
         * The instance initialize before the instance is created.
         *
         * @private
         * @param {boolean} isPage whether is page component initialization
         */
        $init(isPage) {
            initBehaviors(this, isPage, strategyConf);
            initRelations(this, isPage);

            if (!isPage && strategyConf.useNativeBehavior) {
                normalizeBehaviorAttribute(this);
            }
        }
    }
};
