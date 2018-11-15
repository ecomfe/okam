/**
 * @file redux root reducer
 * @author ${author|raw}
 */

import {combineReducers} from 'redux';
import counter from './counter';

export default combineReducers({
    counter
});
