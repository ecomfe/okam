/**
 * @file Make the store observable
 *       Notice: this plugin should used after the observable plugin if using
 *       computed property
 * @author liujiaor@gmail.com
 */

'use strict';

import redux from '../index';

const rawCreated = redux.component.created;

export default {
    component: Object.assign({}, redux.component, {
        onInit() {
            rawCreated.call(this);
        },
        created() {
            // Compatible with the case that OnInit is not supported in the lower version
            if (!this.$isSupportOninit) {
                rawCreated.call(this);
            }
        }
    }),
    page: redux.page
};
