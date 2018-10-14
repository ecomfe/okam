/**
 * @file Behavior
 * @author sparklewhy@gmail.com
 */

'use strict';

import {normalizeBehavior} from './helper';
import mixinStrategy from './strategy';

export default function (behavior) {
    let componentBehavior;
    return isPage => {
        if (isPage || !mixinStrategy.useNativeBehavior) {
            return behavior;
        }

        if (!componentBehavior) {
            componentBehavior = normalizeBehavior(behavior);
        }
        return componentBehavior;
    };
}

