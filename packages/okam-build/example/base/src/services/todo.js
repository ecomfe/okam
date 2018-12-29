/**
 * @file common services
 * @author xxx
 */

import {request as requester} from 'okam';

export function fetchTodoList(pageNo = 1, pageSize = 10) {
    return requester.get('http://localhost:9090/api/todoList', {
        data: {
            pageNo,
            pageSize
        }
    });
}
