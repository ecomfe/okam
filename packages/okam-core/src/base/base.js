/**
 * @file The framework base
 * @author sparklewhy@gmail.com
 */

'use strict';

import * as na from '../na/index';
import api from '../na/api';
import request from '../na/request';

export default {

    /**
     * The native env
     *
     * @type {Object}
     */
    $na: na,

    /**
     * The native API
     */
    $api: api,

    /**
     * The global object
     *
     * @type {Object}
     */
    $global: global,

    /**
     * The http request object
     *
     * @type {Object}
     */
    $http: request
};
