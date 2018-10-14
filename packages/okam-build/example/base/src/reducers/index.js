/**
 * @file redux root reducer
 * @author xxx
 */

import {combineReducers} from 'redux';
import todos from './todos';
import counter from './counter';

export default combineReducers({
    todos,
    counter
});
