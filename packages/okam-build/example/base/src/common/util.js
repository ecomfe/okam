/**
 * @file util
 * @author xxx
 */

export function test() {
    if (process.env.NODE_DEV === 'dev') {
        console.log('dev', 'https://smartapp.baidu.com/test');
        console.log('dv', 'https://my.baidu.com/test');
    }
}
