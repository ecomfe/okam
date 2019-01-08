/**
 * @file Make the page component support behavior/mixin
 * @author sparklewhy@gmail.com
 */

'use strict';

import {initBehaviors} from '../helper';
import {getStrategyConfig} from '../strategy';

let strategyConf;

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
        }
    }
};
