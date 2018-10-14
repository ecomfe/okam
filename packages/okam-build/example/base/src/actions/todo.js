/**
 * @file todo actions
 * @author xxx
 */

import {
    ADD_TODO,
    EDIT_TODO,
    REMOVE_TODO,
    TOGGLE_TODO,
    FETCH_TODOS
} from './type';
import {fetchTodoList} from '../services/todo';

export const getTodoList = function (pageNo, pageSize) {
    return (dispatch, getState) => {
        dispatch({type: FETCH_TODOS, isFetching: true});

        return fetchTodoList(pageNo, pageSize).then(
            res => {
                dispatch({type: FETCH_TODOS, todos: res});
            },
            err => {
                dispatch({type: FETCH_TODOS, isFail: true, err});
            }
        );
    };
};

export const addTodo = todo => ({
    type: ADD_TODO,
    todo: {
        id: Date.now(),
        text: todo,
        completed: false
    }
});

export const editTodo = (todo, id) => ({
    type: EDIT_TODO,
    todo,
    id
});

export const removeTodo = id => ({
    type: REMOVE_TODO,
    id
});

export const toggleTodo = id => ({
    type: TOGGLE_TODO,
    id
});
