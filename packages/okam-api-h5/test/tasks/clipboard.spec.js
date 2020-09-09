/**
 * @file clipboard test spec
 * @author magicchewl@gmail.com
 */
const api = require('api/system').default;

const API_NAME_SET = 'set-clipboard-data';

describe('API [' + API_NAME_SET + ']', () => {
    // failcallback 能否正确调用
    it('should call the failCallback when lack of params.data', done => {
        api.setClipboardData({
            fail: () => {
                done();
            }
        });
    });

    // successCallback能否正确调用
    it('should call the success when window.clipboardData.setData was avalible', done => {
        document.queryCommandSupported = document.execCommand = function () {
            return true;
        };
        api.setClipboardData({
            data: 'test clipboard',
            success: () => {
                done();
            }
        });
    });

    // completeCallback 能否正确调用
    it('should call the completeCallback when window.clipboardData.setData was avalible', done => {
        api.setClipboardData({
            data: 'test clipboard',
            complete: () => {
                done();
            }
        });
    });

    // failCallback 能否正确调用
    it('should call the failCallback when window.clipboardData.setData failed', done => {
        document.queryCommandSupported = document.execCommand = undefined;
        api.setClipboardData({
            data: 'test clipboard',
            fail: () => {
                done();
            }
        });
    });
});
