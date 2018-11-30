/**
 * @file Create wx App instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import initRequest from './request';
import createApp from '../App';
import appBase from '../base/application';

// init request
initRequest();

export default createApp(appBase);
