/**
 * @file The framework base
 * @author sparklewhy@gmail.com
 */

'use strict';

import * as na from '../na/index';
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
    $api: na.api,

    /**
     * The http request object
     *
     * @type {Object}
     */
    $http: request
};
