/**
 * @file userInfo reducer
 * @author xxx
 */

import createReducer from './utils';
const initialState = {};

export default createReducer(initialState, {
    'upUserInfo': (state, {name, age}) => {
        state = Object.assign({}, {name, age})
        return state;
    }
});
