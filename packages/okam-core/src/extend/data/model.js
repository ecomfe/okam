/**
 * @file model support
 * @author xiaohong8023@outlook.com
 */

'use strict';

export default {
    component: {

        /**
         * The instance initialization before the instance is normalized and created.
         *
         * @param {boolean} isPage whether is page component
         * @param {Object=} options the extra init options
         * @param {boolean=} options.isSupportModel support model
         * @param {boolean=} options.isSupportObserve support data observe
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
