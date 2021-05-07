/**
 * @file Create swan App instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import createApp from '../App';
import appBase from '../base/application';
import initApi from '../base/init-api';

export default createApp(Object.assign(appBase, {
    onPrefetch() {
        initApi.call(this);
    }
}));

