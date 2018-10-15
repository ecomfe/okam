# 项目配置

## 配置定义

* 配置文件路径： `<ProjectRoot>/project.json5`

* 使用的语法基于 `json5`，好处是不用写严格的 JSON 语法，像写 JS 普通对象一样简单，也可以加注释

* 配置定义，完全遵从原生小程序定义，没有做任何扩展和修改

    ```json5
    // 项目配置文件
    {
        appid: 0, // 小程序 id
        description: '<mini program description>',
        projectname: '<mini program name>',
        miniprogramRoot: './dist'
    }
    ```

!> 由于项目配置文件主要是开发者工具使用，会用于记录开发者工具的一些偏好设置，比如编译方式等，因此该配置文件只会在构建阶段输出到目标文件位置不存在的时候才会输出该文件。同时为了避免简单删掉构建输出目录，比如 `rm -rf dist` 导致项目配置文件也被一并删除，甚至影响开发者工具的稳定性，建议使用 构建的 `--clean` 命令行选项，该选项会删掉构建产物，但会保留项目配置文件。具体可以使用项目的 `npm run dev:clean` script 命令执行。

## 自定义配置语法

**注意：** 允许改变项目配置文件的语法，默认情况下不能改变配置文件名称，即必须为 `project`

* 如果不想用 `json5` 语法，你可以用回 JSON 语法，文件命名为：`project.json`

* 也可以自定义自己的语法，比如基于 `yaml`，文件命名为：`project.yaml`

    * 实现自己的处理器插件，比如发布的 NPM 包为：`okam-plugin-yaml`，具体参考[构建插件定义](build/plugin.md)

    * 构建配置文件：`swan.config.js` 加上如下配置

        ```javascript
        {
            processors: {
                yaml: {
                    processor: 'okam-plugin-yaml',
                    extnames: ['yaml'],
                    rext: 'json' // 输出文件扩展名
                }
            }
        }
        ```

