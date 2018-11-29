# 构建机制

`okam` 从 `0.4.0` 版本开始，构建是基于依赖分析进行的构建，理想情况下，构建输出的产物应该都是用到的代码或者资源。但目前分析的依赖还不是特别全面，主要包括如下几种情况：

* 脚本的依赖，基于 `require`、`import` 语法分析确定依赖

* 页面组件的依赖，基于 `app.js` `config` 属性定义的 `pages` 信息

* 原生组件的 `usingComponents` 定义的依赖组件信息，同时基于组件同名规则查找其它几个依赖的资源文件，包括脚本、样式、模板、配置文件

* 模板 `include` `import` 引用的模板文件

* 定义的入口脚本、样式文件以及项目配置文件

* 原生组件样式里依赖的 `css` 样式，分析 `import` 语法

* 对于使用了预处理语言的样式，只会输出组件样式、入口样式文件，对于依赖其它样式不会输出，比如 `base.styl` 等

* 图片资源，目前对于项目源目录下所有图片资源都作为项目依赖 `后续需要优化下`

* 其它资源比如字体文件等，目前没有作为依赖分析 `后续需要优化下`

## 自定义要输出的资源文件

* 如果有资源文件依赖没有被分析到，导致无法输出（仅限于项目源码资源文件），可以通过构建配置项 `source.include` 强制引入要构建输出的资源文件，此外能不能输出，还要依赖于下面介绍的 `output.file` 构建配置

    ```javascript
    {
        source: {
            include: ['common/font/xxx.woff']
        }
    }
    ```

* 基于 `output.file` 定制是否输出该资源文件，以及输出的资源文件路径，下述列出来的小程序默认输出文件的配置

    ```javascript
    {
        output: {

           /**
            * 自定义输出文件路径。
            * 如果该文件不输出，返回 `false`。
            *
            * @param {string} path 要输出的文件相对路径
            * @param {Object} file 要输出的文件对象
            * @return {boolean|string}
            */
            file(path, file) {
                // do not output not compiled file and sfc file component
                if (!file.allowRelease || file.isComponent) {
                    return false;
                }

                path = path.replace(/^src\//, '');
                return path;
            }
        }
    }
    ```
