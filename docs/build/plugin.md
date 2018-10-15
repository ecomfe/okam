# 自定义插件

## 插件定义

* 一个简单的自定义插件示例

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

## 插件使用

* 在构建配置里注册处理器

```javascript
{
    processors: {
        myPlugin: {
            processor: './tools/myPlugin' // 如果发布到 NPM，可以直接指定包名，前提得先安装该插件 NPM 包
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

## 第三方插件

具体可以查看[插件列表章节](plugins/imgCompress)
