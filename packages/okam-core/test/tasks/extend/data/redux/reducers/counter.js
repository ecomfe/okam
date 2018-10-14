/**
 * @file counter reducers
 * @author xxx
 */

export default (state = 0, action) => {
    let {type, value} = action;
    switch (type) {
        case 'INCREMENT':
            return state + value;
        case 'DECREMENT':
            return state - value;
        default:
            return state;
    }
};
