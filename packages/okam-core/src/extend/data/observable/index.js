/**
 * @file Make component support data operation like Vue for mini program
 * @author sparklewhy@gmail.com
 */

'use strict';

import observable from './base';
import initProps from './initProps';
import proxyArrayApis from './array';

export default {
    component: Object.assign({}, observable, {
        __initProps: initProps,
        proxyArrayApis
    })
};
