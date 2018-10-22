/**
 * @file The framework base
 * @author sparklewhy@gmail.com
 */

'use strict';

import {global} from '../na/index';
import request from '../na/request';

export default {

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
