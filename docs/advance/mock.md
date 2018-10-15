# 接口 Mock

为了实现请求接口 Mock，开发框架默认提供了如下一些基础设施。

## 本地开发 Server

为了 Mock 请求接口，需要提供一个本地开发 Server，只需要增加如下构建配置：

```javascript
// swan.config.js
{
    server: { // 启用开发 Server
        port: 9090, // 本地 server 监听的端口
        type: 'express', // server 类型
        middlewares: [] // 要加载的中间件
    }
}
```

开发 Server 配置项：

* `port`: 监听的端口号，可选，默认 `8080`

* `type`: 服务器类型，可选

    * `express`: 需要安装相应的依赖 `npm i express --save-dev`
    * `koa`: 需要安装相应的依赖 `npm i koa --save-dev`
    * `connect`: 默认，需要安装相应的依赖 `npm i connect --save-dev`

* `middlewares`: 启动的 server 要加载的中间件，可选

命令行启动 server，需要在构建启动参数加上 `--server` 选项，也可以通过 `--port 9090` 指定要监听的端口，按项目模板提供的 script，只需要执行：`npm run dev:server`。


## 请求地址替换

开发过程中，代码里指定的请求地址一般都是线上环境，开发测试环节为了避免频繁修改代码或者加入各种 if/else 分支，开发框架提供了一个替换处理器 `replacement`，可以在开发阶段或者测试阶段将其替换成我们期望替换的线下环境或者本地环境：

```javascript
// swan.config.js
{
    dev: { // 为了使 dev 配置的 rules 能生效，需要构建环境变量 NODE_ENV 指定为 dev
        rules: [
            {
                match: 'src/**/*.js',
                processors: [
                    {
                        name: 'replacement',
                        options: {
                            // 将线上环境替换成本地开发环境，用变量 `${devServer}` 引用本地开发 Server 环境
                            'https://online.com': '${devServer}'
                        }
                    }
                    // 也可以用数组形式声明：第一个元素处理器名称，第二个元素处理器的选项
                    // ['replacement', {
                    //     'https://online.com': '${devServer}',
                    // }]
                ]
            }
        ]
    },
    test: { // 为了使 test 配置的 rules 能生效，需要构建环境变量 NODE_ENV 指定为 test
        {
            match: 'src/**/*.js',
            processors: [
                ['replacement', {
                    // 将线上环境替换成测试环境
                    'https://online.com': 'https://test.com',
                }]
            ]
        }
    }
}
````

## Mock 中间件

为了拦截请求进行 mock，可以在前面本地开发 `server` 的 `middlewares` 引入 mock 请求的中间件。

* 可以使用类似 [autoresponse](https://github.com/wuhy/autoresponse) Mock 中间件

    ```javascript
    {
        server: { // 启用开发 Server
            port: 9090, // 本地 server 监听的端口
            type: 'express', // server 类型
            middlewares: [
                require('autoresponse').express({
                    post: true,  // mock all post request
                    patch: true, // mock all patch request
                    get: {       // mock all `/xx/xx` path
                        match: function (reqPathName) {
                            return !/\.\w+(\?.*)?$/.test(reqPathName);
                        }
                    }
                })
            ]
        }
    }
    ```
