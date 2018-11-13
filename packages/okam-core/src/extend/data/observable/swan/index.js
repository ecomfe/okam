/**
 * @file Make component support data operation like Vue for swan mini program
 * @author sparklewhy@gmail.com
 */

'use strict';

import observable from '../index';
// import {observableArray, overrideArrayMethods} from '../array';
// import {component as swanApi, array as swanArray} from './array';
import initProps from '../initProps';

// observable.page = {
//     methods: swanApi
// };
// Object.assign(observable.component.methods, swanApi);

// override the Page array API, as for the native Array data operation API
// only supported in page currently
// let arrApis = Object.assign({}, observableArray, swanArray);
// overrideArrayMethods(arrApis, true);

observable.component.__initProps = initProps;

export default observable;
