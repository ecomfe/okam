/**
 * @file Make component support data operation like Vue for swan mini program
 * @author sparklewhy@gmail.com
 */

'use strict';

import observable from '../index';
import {extendArrayMethods} from '../array';
import {component as swanApi, array as swanArray} from './array';

Object.assign(observable.component.methods, swanApi);
extendArrayMethods(swanArray);

export default observable;
