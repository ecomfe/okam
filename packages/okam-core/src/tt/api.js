/**
 * @file Toutiao App global API
 * @author sparklewhy@gmail.com
 */

/* global tt:false */

import * as platform from '../na/platform';

const api = Object.create(tt);
api.okam = Object.assign({}, platform);

export default api;
