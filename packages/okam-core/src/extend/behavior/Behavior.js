/**
 * @file Behavior
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global Behavior:false */

import {normalizeBehavior} from './helper';
import {normalizeAttributeNames} from '../../helper/component';

export function normalizeBehaviorAttribute(componentInfo) {
    let {mixins, behaviors} = componentInfo;
    if (!behaviors && mixins) {
        delete componentInfo.mixins;
        componentInfo.behaviors = mixins;
    }

    return componentInfo;
}

function normalizeNativeAttributes(componentInfo) {
    normalizeAttributeNames(componentInfo);
    normalizeBehaviorAttribute(componentInfo);

    return componentInfo;
}

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
                /* eslint-disable babel/new-cap */
                componentBehavior.behavior = Behavior(
                    normalizeNativeAttributes(behaviorInfo)
                );
            }
        }
        return componentBehavior;
    };
}

