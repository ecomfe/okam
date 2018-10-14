/**
 * @file Component helper
 * @author sparklewhy@gmail.com
 */

'use strict';

import {normalizeProps} from './props';

export function normalizeComponent(componentInfo) {
    let {props} = componentInfo;

    props && (componentInfo.props = normalizeProps(props));

    return componentInfo;
}
