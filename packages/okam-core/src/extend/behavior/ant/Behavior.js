/**
 * @file Ant Behavior
 * @author sparklewhy@gmail.com
 */

'use strict';

import {normalizeBehavior} from '../helper';
import {normalizeAttributeNames} from '../../../ant/helper/component';

export default function (behavior) {
    let componentBehavior;
    return (isPage, opts) => {
        if (isPage || !opts.useNativeBehavior) {
            return behavior;
        }

        // using native mixin support
        if (!componentBehavior) {
            componentBehavior = normalizeBehavior(behavior, opts);
            let behaviorInfo = componentBehavior.behavior;
            if (behaviorInfo) {
                componentBehavior.behavior = normalizeAttributeNames(behaviorInfo);
            }
        }
        return componentBehavior;
    };
}

