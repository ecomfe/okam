/**
 * @file reducer utils
 * @author xxx
 */

export default function createReducer(initialState, handlers) {
    return (state = initialState, action) => {
        if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
            return handlers[action.type](state, action);
        }
        return state;
    };
}
