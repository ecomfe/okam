/**
 * @file common services
 * @author xxx
 */

import requester from 'okam/request';

export function fetchTodoList(pageNo = 1, pageSize = 10) {
    return requester.get('http://localhost:9090/api/todoList', {
        data: {
            pageNo,
            pageSize
        }
    });
}
