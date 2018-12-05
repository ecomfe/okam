/**
 * @file todos reducer
 * @author xxx
 */

import {
    ADD_TODO,
    EDIT_TODO,
    REMOVE_TODO,
    TOGGLE_TODO,
    FETCH_TODOS
} from '../actions/type';
import createReducer from './utils';

const initialState = [
    {id: 0, text: 'One', completed: false},
    {id: 1, text: 'Two', completed: true},
    {id: 2, text: 'Three', completed: false}
];

function findById(todos, id) {
    let found = -1;
    todos.filter((item, index) => {
        if (item.id === id) {
            found = index;
            return true;
        }
        return false;
    });
    return found;
}

const addTodo = (state, {todo}) => {
    let newArr = [].concat(state);
    newArr.unshift(todo);
    return newArr;
};

const editTodo = (state, {todo, id}) => {
    let found = findById(state, id);
    if (found === -1) {
        return state;
    }

    let newArr = [].concat(state);
    let curr = state[found];
    newArr[found] = Object.assign({}, curr, todo);
    return newArr;
};

const removeTodo = (state, {id}) => {
    let found = findById(state, id);
    if (found === -1) {
        return state;
    }

    let newArr = [].concat(state);
    newArr.splice(found, 1);
    return newArr;
};

const toggleTodo = (state, {id}) => {
    let found = findById(state, id);
    if (found === -1) {
        return state;
    }

    let newArr = [].concat(state);
    let curr = state[found];
    newArr[found] = Object.assign({}, curr, {completed: !curr.completed});
    return newArr;
};

const fetchTodos = (state, {isFetching, todos, isFail}) => {
    if (isFetching) {
        return state;
    }

    if (isFail) {
        return state;
    }

    return todos;
};

export default createReducer(initialState, {
    [ADD_TODO]: addTodo,
    [EDIT_TODO]: editTodo,
    [REMOVE_TODO]: removeTodo,
    [TOGGLE_TODO]: toggleTodo,
    [FETCH_TODOS]: fetchTodos
});
