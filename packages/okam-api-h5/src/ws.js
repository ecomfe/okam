/**
 * @file The websocket API for the H5 app
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global WebSocket:false */

import {processAsyncApiCallback} from './helper';

class SocketTask {

    /**
     * Create socket task
     *
     * @param {string} url the url to connection
     * @param {string|Array.<string>=} protocols the sub protocols to use
     */
    constructor(url, protocols) {
        this.ws = new WebSocket(url, protocols);
        this.CONNECTING = 0;
        this.OPEN = 1;
        this.CLOSING = 2;
        this.CLOSED = 3;
    }

    /**
     * Get connection ready state
     *
     * @return {number}
     */
    get readyState() {
        return this.ws.readyState;
    }

    /**
     * Send data
     *
     * @param {Object} options the options to send
     * @param {string|ArrayBuffer} options.data the data to send
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     */
    send(options) {
        const {data, success, fail, complete} = options;
        const apiName = 'SocketTask.send';

        try {
            this.ws.send(data);
            let res = {errMsg: `${apiName}:ok`};
            success && success(res);
            complete && complete(res);
        }
        catch (ex) {
            let res = {errMsg: `${apiName}:fail ${ex.message || ex.toString()}`};
            fail && fail(res);
            complete && complete(res);
        }
    }

    /**
     * Close connection
     *
     * @param {Object} options the options to close
     * @param {number=} options.code the close status code, by default 1000
     * @param {string=} options.reason the close reason
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     */
    close(options) {
        const {
            code = 1000,
            reason,
            success,
            fail,
            complete
        } = options;

        const apiName = 'SocketTask.close';
        try {
            this.ws.close(code, reason);
            let res = {errMsg: `${apiName}:ok`};
            success && success(res);
            complete && complete(res);
        }
        catch (ex) {
            let res = {errMsg: `${apiName}:fail ${ex.message || ex.toString()}`};
            fail && fail(res);
            complete && complete(res);
        }
    }

    /**
     * Listen the connection open event
     *
     * @param {Function} callback the callback to execute when open
     */
    onOpen(callback) {
        this.ws.addEventListener('open', callback);
    }

    /**
     * Listen the message received event
     *
     * @param {Function} callback the callback to execute when receiving message
     */
    onMessage(callback) {
        this.ws.addEventListener('message', e => callback({data: e.data}));
    }

    /**
     * Listen the connection is closed
     *
     * @param {Function} callback the callback to execute when connection is closed
     */
    onClose(callback) {
        this.ws.addEventListener(
            'close',
            ({code, reason}) => callback({code, reason})
        );
    }

    /**
     * Listen the error event
     *
     * @param {Function} callback the callback to execute when an error occurs
     */
    onError(callback) {
        this.ws.addEventListener('error', callback);
    }
}

const socketTasks = [];
const socketListener = {};
let socketTaskCounter = 1;

function initGlobalEventListener(socketTask) {
    Object.keys(socketListener).forEach(k => {
        socketTask[k](socketListener[k]);
    });
}

function connectSocketSync(options) {
    let {url, protocols} = options;
    let task = new SocketTask(url, protocols);
    task.onClose(() => {
        let idx = socketTasks.indexOf(task);
        idx !== -1 && (socketTasks.splice(idx, 1));
    });
    initGlobalEventListener(task);
    socketTasks.push(task);

    return {
        task,
        id: socketTaskCounter++
    };
}

export default {

    /**
     * Connect socket
     *
     * @param {Object} options the connect options
     * @param {string} options.url the url to connect
     * @param {Object=} options.header the header to set, currently is not support
     * @param {Array.<string>=} options.protocols the sub protocols to use
     * @param {boolean=} options.tcpNoDelay whether tcp no delay, optional,
     *        by default false, currently is not support
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     * @return {SocketTask}
     */
    connectSocket(options) {
        let result = processAsyncApiCallback(
            'connectSocket',
            connectSocketSync,
            [options],
            options,
            res => ({socketTaskId: res.id})
        );
        return result && result.task;
    },

    onSocketOpen(callback) {
        socketListener.onOpen = callback;
    },

    onSocketError(callback) {
        socketListener.onError = callback;
    },

    sendSocketMessage(options) {
        let socket = socketTasks[0];
        socket && socket.send(options);
    },

    onSocketMessage(callback) {
        socketListener.onMessage = callback;
    },

    closeSocket(options) {
        let socket = socketTasks[0];
        socket && socket.close(options);
    },

    onSocketClose(callback) {
        socketListener.onClose = callback;
    }
};
