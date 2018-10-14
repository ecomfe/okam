/**
 * @file The framework base
 * @author sparklewhy@gmail.com
 */

'use strict';

import {env, global} from '../na/index';
import request from '../na/request';

export default {

    /**
     * The native api
     *
     * @type {Object}
     */
    $api: env,

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
