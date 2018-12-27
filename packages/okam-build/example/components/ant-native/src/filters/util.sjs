/**
 * @file Ant filter
 * @author xxx
 */
import {toLowerCase} from './string.sjs';
const INFO = 'hello';

export default {
    info: INFO,
    toUpperCase: function (str) {
        return str.toUpperCase();
    },
    toLowerCase
};
