/**
 * @file Make component support data operation like Vue for mini program
 * @author sparklewhy@gmail.com
 */

'use strict';

import observable from './base';
import initProps from './initProps';

observable.component.__initProps = initProps;

export default observable;
