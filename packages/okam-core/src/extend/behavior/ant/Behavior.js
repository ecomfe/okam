/**
 * @file Ant Behavior
 * @author sparklewhy@gmail.com
 */

'use strict';

import {normalizeBehavior} from '../helper';
import mixinStrategy from '../strategy';
import {normalizeAttributeNames} from '../../../ant/helper/component';

export default function (behavior) {
    let componentBehavior;
    return isPage => {
        if (isPage || !mixinStrategy.useNativeBehavior) {
            return behavior;
        }

        if (!componentBehavior) {
            componentBehavior = normalizeBehavior(behavior);
            let behaviorInfo = componentBehavior.behavior;
            if (behaviorInfo) {
                componentBehavior.behavior = normalizeAttributeNames(behaviorInfo);
            }
        }
        return componentBehavior;
    };
}

