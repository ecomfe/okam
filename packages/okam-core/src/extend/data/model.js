/**
 * @file model support
 * @author xiaohong8023@outlook.com
 */

'use strict';

import {normalizeExtendProp} from '../../helper/methods';
import {setDataByPath} from '../../helper/data';

function setData(ctx, expr, value) {
    let data = {
        [expr]: value
    };

    if (ctx.$isSupportObserve) {
        setDataByPath(ctx, data);
        return;
    }

    ctx.setData(data);
}

export default {
    component: {
        methods: {

            /**
             * v-model event proxy handler
             * after __handlerProxy
             *
             * @private
             * @param {Object} event the event object
             */
            __handlerModelProxy(event) {
                // get event dataSet
                const {
                    modelExpr,
                    modelDetail
                } = event.currentTarget.dataset;
                const eventType = event.type;
                if (eventType && modelExpr) {
                    setData(this, modelExpr, event.detail[modelDetail || 'value']);
                }
            }
        },

        /**
         * The instance initialization before the instance is normalized and created.
         *
         * @param {boolean} isPage whether is page component
         * @param {Object=} options the extra init options
         * @param {boolean=} options.isSupportObserve support data observe
         * @private
         */
        $init(isPage, options) {
            let isSupportObserve = options && options.isSupportObserve;

            if (!isSupportObserve) {
                return;
            }

            this._isSupportObserve = isSupportObserve;
            normalizeExtendProp(this, '_isSupportObserve', '$isSupportObserve', isPage);
        }
    }
};
