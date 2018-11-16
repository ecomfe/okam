/**
 * @file Make component support data operation like Vue for weixin mini program
 * @author sparklewhy@gmail.com
 */

'use strict';

import observable from '../index';
import initProps from '../initProps';

observable.component.__initProps = initProps;

export default observable;
