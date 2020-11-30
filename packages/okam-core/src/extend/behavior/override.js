/**
 * @file override oninit function in behavior/mixin
 * @author liujiaor@gmail.com
 */

import {getCurrApp} from '../../na/index';
import base from '../../base/base';

'use strict';

/**
 * oninit functions that need to be rewritten
 *
 * @inner
 * @param {Function} parentFunc the parentFunc
 *
 * @return {Function}
 */
export function overrideOninitFunc(parentFunc) {
    return function (...args) {
        this.$query = args[0] || {};
        if (!this.$isDefineThisProp) {
            this.$isDefineThisProp = true;
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
        parentFunc.apply(this, args);
    };
}
