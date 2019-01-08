/**
 * @file model support
 * @author dengxiaohong01
 */

'use strict';

export default {
    component: {

        /**
         * The instance initialization before the instance is normalized and created.
         *
         * @param {boolean} isPage whether is page component
         * @param {Object=} options the extra init options
         * @param {boolean=} options.model support model
         * @private
         */
        $init(isPage, options) {
            let isSupportModel = options && options.isSupportModel;
            let isSupportObserve = options && options.isSupportObserve;
            if (!isSupportModel) {
                return;
            }

            this._isSupportModel = isSupportModel;
            this._isSupportObserve = isSupportObserve;
        }
    }
};
