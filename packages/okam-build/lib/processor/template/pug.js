/**
 * @file pug template parser
 * @author asd123freedom@gmail.com
 */

const pug = require('pug');

/**
 * Compile pug template
 *
 * @param {Object} file the file to compile
 * @param {Object} options for compile pug template
 * @return {Object}
 */
function compilePug(file, options) {
    let content = file.content.toString();
    // 取出用于pug模板的配置项，包括渲染所需的数据（data字段）
    let config = options.config || {};
    // 考虑到给之后的处理器传递数据，所以这里强制 pretty 为true
    config.pretty = true;
    let data = config.data;
    delete config.data;

    let fn = pug.compile(content, config);
    content = fn(data);

    return {
        content
    };
}

module.exports = compilePug;
