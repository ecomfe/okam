/**
 * @file The quick app page base
 * @author sparklewhy@gmail.com
 */

'use strict';

import component from './component';

export default Object.assign({}, component, {
    onInit() {
        this.$isPage = true;
        this.$query = {};
        // TODO: cannot get the query info

        // call component create life cycle method
        this.created();
    }
});
