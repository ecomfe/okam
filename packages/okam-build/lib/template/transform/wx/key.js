/**
 * @file 解析微信的key
 * @author zhoudan03
 * @date 2018/9/17
 */

module.exports = function (attrs, name, tplOpts) {
    let {logger, file} = tplOpts;
    const itemName = attrs['wx:for-item'] || 'item';
    let value = attrs[name];

    // wx:key的值只允许以下两种情况，否则不做处理，但给出警告
    // 1.用*this标识遍历数组的元素自身，
    // 2.用遍历数组的元素的属性名称
    if (value === itemName) {
        value = '*this';
    }
    else if (value.includes('.')) {
        const array = value.split('.');
        if (array[0] === itemName) {
            value = array[1];
        }
        else {
            logger.warn(`${file.path} key value '${attrs[name]}' maybe not valid`);
        }
    }
    else {
        logger.warn(`${file.path} key value '${attrs[name]}' maybe not valid`);
    }

    attrs['wx:key'] = value;
    delete attrs[':key'];
};
