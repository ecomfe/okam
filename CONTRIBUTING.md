# Okam 代码开发

## 快速开始

### 开发

* 环境准备

    * Node 安装：版本要求 `>=8`

    * 安装依赖

        ```shell
        npm run init # 会自动安装所有包的依赖以及建立内部包之间依赖的软链接
        ```

* 目录结构

```
.
├── README.md
├── lerna.json      // lerna 工具的配置
├── package.json    // 所有 packages 共同开发依赖可以放在该里面定义
├── packages        // 所有最终要发布到 NPM 的包，每个包都有独立的依赖声明信息: package.json
│   ├── okam-build  // 构建工具
│   ├── okam-helper // 构建辅助工具库
│   └── okam-core   // 基础框架扩展
└── scripts         // 构建相关脚本
```

### 包的管理

项目的所有 packages 管理是基于 [lerna](https://github.com/lerna/lerna)，因此基于该工具可以很方便进行包依赖管理、发布等操作。

* 建立内部包的依赖

    ```shell
    lerna add okam-build --scope=okam-cli # 为 okam-cli 增加 okam-build 依赖
    ```

### 代码提交规范

* commit 消息要求符合如下格式：

```shell
git commit -m '<type>(<scope>): <subject>'
```

* 如果对于规范不太了解，可以用交互式命令提交

```shell
npm run commit
```

## 测试

提交代码需要有尽可能完善的单测覆盖，具体测试用例撰写可以参考各个模块的测试。

