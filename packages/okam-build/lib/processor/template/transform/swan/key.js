/**
 * @file 处理 swan时的key
 * @author zhoudan03
 * @date 2018/9/17
 */

module.exports = function (attrs, name, tplOpts) {
    let {logger, file} = tplOpts;
    logger.warn(`${file.path}, swan is not support with :key`);
    delete attrs[':key'];
};
