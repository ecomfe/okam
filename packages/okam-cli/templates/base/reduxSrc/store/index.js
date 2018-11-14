/**
 * @file redux store
 * @author ${author|raw}
 */

import {createStore} from 'redux';
import reducer from '../reducers/index';

export default createStore(reducer);
