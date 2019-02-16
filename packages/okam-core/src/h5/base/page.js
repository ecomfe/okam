/**
 * @file The h5 app page base
 * @author sparklewhy@gmail.com
 */

'use strict';

import component from './component';

export default Object.assign({}, component, {

    beforeCreate() {
        component.beforeCreate.call(this);
        this.$isPage = true;
        this.$query = this.$route.query;

        // call wx native onLoad hook
        this.onLoad && this.onLoad();
    }
});
