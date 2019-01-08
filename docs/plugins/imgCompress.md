# 图片压缩

## 安装

`npm install okam-plugin-tinyimg --save-dev`


## 配置

`swan.config.js` 加上如下配置：

``` javascript
{
    dev: { // 开发环境配置，构建时候命令行参数加上： NODE_ENV=dev
        rules: [
            {
                match: /\.(png|jpe?g|gif)(\?.*)?$/,
                processors: {
                    tinyimg: {
                        // boolean 是否替换源文件, 默认为 false
                        replaceRaw: true,

                        // 若 replaceRaw 为 true, 源文件存放的位置，默认为 'doc/img' (相对于项目根文件, 不提交)
                        releaseSourcePath: 'doc/img'
                    }
                }
            }
        ]
    },
}

```

## 说明

* `releaseSourcePath: true`。`boolean` 是否替换源文件, 默认为 `false`, 不进行原图片文件替换，推荐设置为 `true`, 可加快压缩及构建时间；
* `releaseSourcePath: 'doc/img'`。`string`, 源文件存放的路径(`replaceRaw` 为 `true` 生效), 相对于项目根文件 默认为 `'doc/img'`, 在项目目录下时 建议：code 配置原文件不提交

* 压缩图片处理会在 `okam` 项目文件下生成一个 `.tinyimgcache` 文件，用于对已压缩及处理图片做标记，标记已处理的文件不会二次压缩且本地同一文件内容会走缓存压缩，建议不要 `.gitignore` 或删除, 可提交至代码仓库中，这样二次拉取代码已压缩的图片也不会进行二次压缩

* `.gitignore` 文件 可添加一行配置

```
# 源图片文件不提交到 git 上
# tiny img source files
doc/img/src/
```

* 此压缩为异步过程

## 效果

`dev` 模式构建时 出现以下任意情况说明运行成功

```
okam [INFO] src/common/img/game.png compressed [1482->1421](4.12%)
okam [INFO] source file src/common/img/game.png has been move to doc/img/src/common/img
okam [INFO] src/common/img/game.png has been replaced
okam [INFO] src/common/img/game.png has been cached

okam [INFO] src/common/img/go_arrow.png compressed by cache /Users/xxx/.okam
okam [INFO] source file src/common/img/go_arrow.png has been move to doc/img/src/common/img
okam [INFO] src/common/img/go_arrow.png has been replaced

okam [INFO] process src/common/img/game.png 415 ms
okam [INFO] src/common/img/go_arrow.png has been compressed

```
