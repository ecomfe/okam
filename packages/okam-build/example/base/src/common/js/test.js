export function isCheck() {
    let q = 0;
    if (process.env.APP_TYPE === 'wx') {
        q = 111;
    }
    if (process.env.APP_TYPE === 'swan') {
        q = 222;
    }
    if (process.env.APP_TYPE === 'h5') {
        q = 333;
    }
    console.log('q', q);
}