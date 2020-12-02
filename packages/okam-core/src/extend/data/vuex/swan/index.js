/**
 * @file Make the store observable
 *       Notice: this plugin should used after the observable plugin if using
 *       computed property
 * @author liujiaor@gmail.com
 */

'use strict';

import vuexBase from '../index';

const rawBeforeCreate = vuexBase.component.beforeCreate;

export default {
    component: Object.assign({}, vuexBase.component, {
        onInit() {
            rawBeforeCreate.call(this);
        },
        beforeCreate() {
            // Compatible with the case that OnInit is not supported in the lower version
            if (!this.$isSupportOninit) {
                rawBeforeCreate.call(this);
            }
        }
    }),
    page: vuexBase.page
};
