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

/**
 * Initialize the model value
 *
 * @inner
 */
function initModel() {

    let isSupportObserve = this.$isSupportObserve;

    if (typeof isSupportObserve === 'function') {
        this.$isSupportObserve = isSupportObserve();
    }

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
                const {okamModelArgs} = event.currentTarget.dataset;

                if (!okamModelArgs) {
                    return;
                }

                const eventType = event.type;

                // 约定: 第一个为值表达式，第二个为detail值key名
                let [modelExpr, modelDetail] = okamModelArgs.split(',');
                if (eventType && modelExpr) {
                    let value = modelDetail == null
                        ? event.detail
                        : event.detail[modelDetail];
                    setData(this, modelExpr, value);
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

            // 如果 false 直接返回 减少属性设置
            if (!isSupportObserve) {
                return;
            }

            this._isSupportObserve = isSupportObserve;
            normalizeExtendProp(this, '_isSupportObserve', '$isSupportObserve', isPage);
        },

        /**
         * The created hook
         *
         * @private
         */
        created() {
            // init component model
            initModel.call(this);
        }
    }
};
