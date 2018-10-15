# 分包加载

百度小程序支持[分包加载](https://smartprogram.baidu.com/docs/develop/framework/subpackages/)，允许开发者将小程序划分成不同的子包，在构建时打包成不同的分包，用户在使用时按需进行加载。以提升首屏加载效率，同时也满足小程序日益增加的体积需求。

`okam`对此的处理是将分包文件当做`Page`组件进行解析，分包内的文件允许使用`okam`的[Page组件](/component/page?id=page-%E7%BB%84%E4%BB%B6)所支持的所有语法。


开发者的`src`对应的目录结构如下（注意：**src内，除了分包以外的所有文件都属于主包**）

```
└── src
    ├── app.js
    ├── app.styl
    ├── common
    │   ├── biz
    │   ├── css
    │   ├── img
    │   └── tpl
    ├── components
    └── pages        // 主包对应的页面
    │   ├── home
    │   ├── ...
    │   └── ...
    ├── packageA     // 分包
    │   └── pages
    │       ├── subPageA       // 分包的子目录
    │       │   ├── index     // 分包内的页面
    │       │   └── ...
    │       └── ...
    ├── packageB     // 分包
    │   └── pages
    │       ├── subPageB
    │       │   ├── index
    │       │   └── ...
    │       └── ...

```

开发者在`app.js`的`config`属性中增加`subPackages`字段即可（同原生小程序），该配置在构建之后，会被平移到`app.json`中。
```app.js
config: {
    pages: [
            'pages/home/index'
        ],
    // 新增此subPackages字段配置
    subPackages: [
        {
            root: 'packageA',
            pages: [
                'pages/subPageA/index'
            ]
        }, {
            root: 'packageB',
            pages: [
                'pages/subPageB/index'
            ]
        }
    ]
}
```


** 开发者需要遵循原生小程序的打包原则及引用原则 **

* 分包的根目录不能是另外一个分包内的子目录
* 首页的 `TAB` 页面必须在主包内
* 分包无法 `require` 其他分包的 `JS` 文件，但可以 `require` 主包、自己分包内的 `JS` 文件
* 分包无法 `import` 其他分包的 `template`，但可以 `require` 主包、自己分包内的 `template`
* 分包无法使用其他分包的资源，但可以使用主包、自己分包内的资源

<br>

** 目前小程序分包大小限制为：**
* 整个小程序所有分包大小不超过 `8M`
* 单个分包/主包大小不能超过 `2M`
* 除了分包以外的所有文件都属于主包，即：`小程序产出目录体积` `-` `分包目录的体积`，应该小于`2M`

<br>

** 注意小程序内的路由是以代码根路径为基准，因此如果需要跳转到分包内`packageA`的`subPageA`下的`index`页面，路由应为`"/packageA/pages/subPageA/index"`，
具体代码如下：**
```
<navigator url="/packageA/pages/subPageA/index">go sub page A</navigator>
```
```
this.$api.navigateTo({url:"/packageA/pages/subPageA/index"})
```

!> 分包加载从百度APP客户端`10.8`版本及以上开始支持，开发者无需处理兼容性问题。对于低版本的客户端，小程序后台会直接上传整包。参考原生小程序文档的[分包加载](https://smartprogram.baidu.com/docs/develop/framework/subpackages/)
