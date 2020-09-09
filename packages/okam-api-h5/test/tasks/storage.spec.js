/**
 * @file storage test spec
 * @author magicchewl@gmail.com
 */
/* global localStorage:false */
/* global before:false */
'use strict';

require('jsdom-global')('', {
    url: 'http://localhost'
});
const api = require('api/storage').default;

const localStorage = window.localStorage;

const TEST_KEY = 'testkey';
const API_NAME_SET = 'set-storage';
describe('API [' + API_NAME_SET + ']', () => {
    afterEach(() => {
        localStorage.removeItem(TEST_KEY);
    });
    // 未传参数不报异常
    it('should not throw error when lack of params', () => {
        api.setStorage({});
    });

    // 能否正确执行
    it('should store data correctly', () => {
        api.setStorage({
            key: TEST_KEY,
            data: 'testdata'
        });
        const data = localStorage.getItem(TEST_KEY);
        expect(data).toBe('3=testdata');
    });

    // success 回调是否正常执行
    it('successCallback should be called correctly', done => {
        api.setStorage({
            key: TEST_KEY,
            data: 'testdata',
            success: () => {
                done();
            }
        });
    });

    // complete 回调是否正常执行
    it('completeCallback should be called correctly', done => {
        api.setStorage({
            key: TEST_KEY,
            data: 'testdata',
            complete: () => {
                done();
            }
        });
    });
});

const API_NAME_SET_SYN = 'set-storage-sync';
describe('API [' + API_NAME_SET_SYN + ']', () => {
    afterEach(() => {
        localStorage.removeItem(TEST_KEY);
    });
    it('should run success if params key not exist', () => {
        api.setStorageSync();
    });
    // 数据存储是否正确
    it('should storage the data correctly', () => {
        api.setStorageSync(TEST_KEY, 'teststoragesync');
        const data = localStorage.getItem(TEST_KEY);
        expect(data).toBe('3=teststoragesync');
    });
});

const API_NAME_GET = 'get-storage';
describe('API [' + API_NAME_GET + ']', () => {
    before(() => {
        api.setStorageSync(TEST_KEY, 100);
    });
    after(() => {
        localStorage.removeItem(TEST_KEY);
    });

    it('should return correct success data', done => {
        api.getStorage({
            key: TEST_KEY,
            success: data => {
                expect(data.data).toBe(100);
                done();
            }
        });
    });

    it('should return correct success data when data was not defined', done => {
        api.getStorage({
            key: 'testaaa',
            success: data => {
                expect(data.data).toNotExist();
                done();
            }
        });
    });

    it('successCallback should be called correctly', done => {
        api.getStorage({
            key: TEST_KEY,
            success: () => {
                done();
            }
        });
    });

    it('completeCallback should be called correctly', done => {
        api.getStorage({
            key: TEST_KEY,
            complete: () => {
                done();
            }
        });
    });

});

const API_NAME_GET_SYN = 'get-storage-sync';
describe('API [' + API_NAME_GET_SYN + ']', () => {
    before(() => {
        localStorage.setItem(TEST_KEY, '1=100');
    });
    after(() => {
        localStorage.removeItem(TEST_KEY);
    });
    it('should run success if params key not exist', () => {
        api.getStorageSync();
    });
    // 获取数据是否正确
    it('should get the storage data correctly', () => {
        const data = api.getStorageSync(TEST_KEY);
        expect(data).toBe(100);
    });

    it('should get the storage data correctly when the data was not exist', () => {
        const data = api.getStorageSync('testbbb');
        expect(data).toNotExist();
    });
});

const API_NAME_REMOVE = 'remove-storage';
describe('API [' + API_NAME_REMOVE + ']', () => {
    before(() => {
        localStorage.setItem(TEST_KEY, '{"apiStorage":100}');
    });
    after(() => {
        localStorage.removeItem(TEST_KEY);
    });

    it('should not throw error when lack of params', () => {
        api.removeStorage({});
    });

    // 能否正确执行
    it('should return correct', done => {
        api.removeStorage({
            key: TEST_KEY,
            success: () => {
                const data = localStorage.getItem(TEST_KEY);
                expect(data).toBe(null);
                done();
            }
        });

    });

    // success 回调是否正常执行
    it('successCallback should be called correctly', done => {
        api.setStorageSync(TEST_KEY, '1111');
        api.removeStorage({
            key: TEST_KEY,
            success: () => {
                done();
            }
        });
    });

    // complete 回调是否正常执行
    it('completeCallback should be called correctly', done => {
        api.setStorageSync('testaa', '222');
        api.removeStorage({
            key: 'testaa',
            complete: () => {
                done();
            }
        });
    });
});

const API_NAME_REMOVE_SYN = 'remove-storage-sync';
describe('API [' + API_NAME_REMOVE_SYN + ']', () => {
    // 移除数据是否正确
    it('should reove the storage data correctly', () => {
        api.setStorageSync('testremove', 'testremove');
        api.removeStorageSync('testremove');
        const data = localStorage.getItem('testremove_testkey');
        expect(data).toBe(null);
    });

});

const API_NAME_CLEAR = 'clear-storage';
describe('API [' + API_NAME_CLEAR + ']', () => {
    before(() => {
        api.setStorageSync('test1', 'aaa');
        api.setStorageSync('test2', 'bbb');
    });

    it('should clear the localstorage correctly', () => {
        api.clearStorage();
        let number = 0;
        for (const item in localStorage) {
            if (localStorage.hasOwnProperty(item) && item.indexOf(window.appkey) > 0) {
                number++;
            }
        }
        expect(number).toBe(0);
    });
});

const API_NAME_CLEAR_SYN = 'clear-storage-sync';
describe('API [' + API_NAME_CLEAR_SYN + ']', () => {
    before(() => {
        api.setStorageSync('test1', 'aaa');
        api.setStorageSync('test2', 'bbb');
    });

    it('should clear the localstorage correctly', () => {
        api.clearStorageSync();
        let number = 0;
        for (const item in localStorage) {
            if (localStorage.hasOwnProperty(item) && item.indexOf(window.appkey) > 0) {
                number++;
            }
        }
        expect(number).toBe(0);
    });
});

const API_NAME_INFO = 'get-storage-info';
describe('API [' + API_NAME_INFO + ']', () => {
    before(() => {
        api.setStorageSync('test1', 'aaa');
        api.setStorageSync('test2', 'bbb');
    });

    it('should return correct response', done => {
        api.getStorageInfo({
            success: res => {
                expect(res.keys[0]).toBe('test1');
                expect(res.keys[1]).toBe('test2');
                expect(res.currentSize).toBe(-1);
                expect(res.limitSize).toBe(-1);
                done();
            }
        });
    });

    it('successCallback should be called correctly', done => {
        api.getStorageInfo({
            success: () => {
                done();
            }
        });
    });

    // complete 回调是否正常执行
    it('completeCallback should be called correctly', done => {
        api.getStorageInfo({
            complete: () => {
                done();
            }
        });
    });

});

const API_NAME_INFO_SYN = 'get-storage-info-sync';
describe('API [' + API_NAME_INFO_SYN + ']', () => {
    it('should return correct response', () => {
        const data = api.getStorageInfoSync();
        expect(data.keys[0]).toBe('test1');
        expect(data.keys[1]).toBe('test2');
        expect(data.currentSize).toBe(-1);
        expect(data.limitSize).toBe(-1);
    });

});
