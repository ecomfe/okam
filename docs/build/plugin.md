# 自定义处理器

## 处理器定义

* 一个简单的自定义处理器示例

    ```javascript
    function compile(file, options) {
        let json5 = require('json5');

        let obj = json5.parse(file.content.toString());
        let result = JSON.stringify(obj, null, 4);

        return {
            content: result
        };
    }

    module.exports = exports = compile;
    ```

## 处理器使用

* 在构建配置里注册处理器

```javascript
{
    processors: {
        myPlugin: {
            processor: './tools/myPlugin' // 如果发布到 NPM，可以直接指定包名，前提得先安装该处理器 NPM 包
        }
    },

    rules: [
        match: '*.js',
        processors: [
            'myPlugin'
        ]
    ]
}
```

## 第三方处理器

具体可以查看[处理器列表章节](plugins/imgCompress)
