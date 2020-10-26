/**
 * @file 浏览器历史
 * @author
 */

/* global window:false */

import * as Storage from './storage';
const KEY = 'browser_history';
class BrowserHistory {
    constructor() {
        this.list = [];
    }
    backTo(reg) {
        let browserHistoryList = this.list;
        let browserHistoryLength = browserHistoryList.length;
        if (browserHistoryLength >= 2) {
            let len = 0;
            while (len < browserHistoryLength && !reg.test(browserHistoryList[browserHistoryLength - 1 - len].path)) {
                len++;
            }
            if (
                len === browserHistoryLength
                || !reg.test(browserHistoryList[browserHistoryLength - len - 1].path)
            ) {
                return false;
            }

            if (len !== 0) {
                window.history.go(-len);
            }

            return true;
        }

        return false;
    }
    get(index) {
        if (index == null) {
            return this.list;
        }

        return this.list[index];
    }
    set(list) {
        this.list = list;
        Storage.set(KEY, list, true);
    }
    get length() {
        return this.list.length;
    }
}
export default new BrowserHistory();
