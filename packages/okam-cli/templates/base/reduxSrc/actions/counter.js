/**
 * @file todo actions
 * @author ${author|raw}
 */

import {
    INCREMENT_COUNTER,
    DECREMENT_COUNTER
} from '../constants/counter';

export const addCounter = (value = 1) => ({
    type: INCREMENT_COUNTER,
    value
});

export const reduceCounter = (value = 1) => ({
    type: DECREMENT_COUNTER,
    value
});

