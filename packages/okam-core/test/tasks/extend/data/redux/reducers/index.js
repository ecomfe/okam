/**
 * @file redux root reducer
 * @author xxx
 */

import {combineReducers} from 'redux';
import counter from './counter';

export default combineReducers({
    counter
});
