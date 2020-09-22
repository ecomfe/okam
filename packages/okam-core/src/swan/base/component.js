/**
 * @file The component base
 * @author liujiaor@gmail.com
 */

'use strict';

import componentBase from '../../base/component';
import {getCurrApp} from '../../na/index';
import EventListener from '../../util/EventListener';
import base from '../../base/base';

export default Object.assign({}, componentBase, {

    /**
     * The created hook when component is created
     *
     * @private
     */
    created() {
        if (!this.$isPage
            || (this.$isPage && !this.$isSupportOninit)) {
            let propDescriptors = {
                $app: {
                    get() {
                        return getCurrApp();
                    }
                }
            };
            Object.keys(base).forEach(k => {
                propDescriptors[k] = {
                    get() {
                        return base[k];
                    }
                };
            });

            Object.defineProperties(this, propDescriptors);

        }
        this.$listener = new EventListener();
        // call beforeCreate hook
        this.beforeCreate && this.beforeCreate();
    },
    methods: Object.assign({}, componentBase.methods)
});
