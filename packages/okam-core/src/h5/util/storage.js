/**
 * @file 本地存储
 * @author
 */

/* global window:false */
/* global sessionStorage:false */
/* global localStorage:false */

class Storage {
    constructor() {
        this.data = {};
    }
    setItem(key, value) {
        this.data[key] = value;
    }
    getItem(key) {
        return this.data[key];
    }
}
let ls = null;
let ss = null;
try {
    ls = window.localStorage;
    ss = window.sessionStorage;
}
catch (e) {
    ls = new Storage();
    ss = new Storage();
}
const PREFIX = 'MARS_';

/**
 * 设置存储
 *
 * @param {string} key 键
 * @param {*} value 值
 * @param {bool} session 是否是 session
 *
 * @return {Object} 储存的数据
 */
export function set(key, value, session = false) {
    const storage = session ? ss : ls;
    if (!storage) {
        return false;
    }
    try {
        storage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    }
    catch (e) {
        return false;
    }
    return true;
}

/**
 * 获取存储的数据
 *
 * @param {string} key 键
 * @param {*} d 默认的值
 * @param {bool} session 是否是 session
 *
 * @return {Object} 储存的数据
 */
export function get(key, d, session = false) {
    const storage = session ? ss : ls;
    let s = storage.getItem(`${PREFIX}${key}`);
    try {
        s = JSON.parse(s);
        if (!s) {
            s = d;
        }
    }
    catch (e) {
        s = d;
    }
    return s;
}

/**
 * 删除存储的数据
 *
 * @param {string} key 键
 * @param {bool} session 是否是 session
 */
export function remove(key, session = false) {
    const Storage = session ? sessionStorage : localStorage;
    Storage.removeItem(`${PREFIX}${key}`);
}