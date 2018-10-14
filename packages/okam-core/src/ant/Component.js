/**
 * @file Create ant component instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import {createComponent} from './helper/factory';
import {normalizeComponent} from './helper/component';
import componentBase from './base/component';

export default function extendComponent(componentInfo, refComponents) {
    return createComponent(
        componentInfo,
        componentBase,
        normalizeComponent,
        refComponents
    );
}
