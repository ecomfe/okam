/**
 * @file Weixin App global API
 * @author sparklewhy@gmail.com
 */

/* global wx:false */

import * as platform from '../na/platform';

const api = Object.create(wx);
api.okam = Object.assign({}, platform);

export default api;
