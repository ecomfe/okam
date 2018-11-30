/**
 * @file redux root reducer
 * @author xxx
 */

import {combineReducers} from 'redux';
import todos from './todos';
import counter from './counter';
import userInfo from './userInfo';

export default combineReducers({
    todos,
    counter,
    userInfo
});
