/**
 * @file counter reducers
 * @author ${author|raw}
 */

import {
    INCREMENT_COUNTER,
    DECREMENT_COUNTER
} from '../constants/counter';

export default (state = 0, action) => {
    let {type, value} = action;
    switch (type) {
        case INCREMENT_COUNTER:
            return state + value;
        case DECREMENT_COUNTER:
            return state - value;
        default:
            return state;
    }
};
