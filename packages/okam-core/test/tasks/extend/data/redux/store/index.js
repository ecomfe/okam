/**
 * @file redux store
 * @author xxx
 */

import {createStore} from 'redux';
import reducer from '../reducers/index';

export default createStore(reducer);
