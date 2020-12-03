/**
 * @file Make component support data operation like Vue for swan mini program
 * @author sparklewhy@gmail.com
 */

'use strict';

import observable from '../base';
import initProps from '../initProps';
import proxyArrayApis from '../array';

const rawCreated = observable.created;

export default {
    component: Object.assign({}, observable, {
        onInit() {
            rawCreated.call(this);
        },
        created() {
            if (!this.$isPage
                || (this.$isPage && !this.$isSupportOninit)) {
                rawCreated.call(this);
            }
        },
        __initProps: initProps,
        proxyArrayApis
    })
};
