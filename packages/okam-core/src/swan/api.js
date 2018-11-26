/**
 * @file Swan App global API
 * @author sparklewhy@gmail.com
 */

/* global swan:false */

import * as platform from '../na/platform';

const api = Object.create(swan);
api.okam = Object.assign({}, platform);

export default api;
