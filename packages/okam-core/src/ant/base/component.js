/**
 * @file Ant Component base
 * @author sparklewhy@gmail.com
 */

'use strict';

import componentBase from '../../base/component';

export default Object.assign(componentBase, {
    didMount() {
        this.created();
        this.attached();
        this.ready();
    },

    didUpdate() {
        this.beforeUpdate && this.beforeUpdate();
        this.updated && this.updated();
    },

    didUnmount() {
        this.detached();
    }
});
