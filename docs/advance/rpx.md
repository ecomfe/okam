# 样式 rpx 单位转换

原生小程序提供了响应式的单位：`rpx`（responsive pixel）: 可以根据屏幕宽度进行自适应。规定屏幕宽为 `750rpx`。如在 iPhone6 上，屏幕宽度为 `375px`，共有 `750` 个物理像素，则 `750rpx` = `375px` = `750物理像素`，`1rpx` = `0.5px` = `1物理像素`。

## `px2rpx` 插件

为了提升开发效率，避免人工做这个转换，可以通过 `postcss` 的 `px2rpx` 插件来自动完成像素单位的转换。

* 在构建配置里增加样式处理规则
* 指定 postcss 处理器的处理选项：增加 `px2rpx` 转换插件
* 从 `0.4` 版本开始，可以在全局配置 `designWidth` 属性，无需在插件 `px2rpx` 里配置，如果配置了会覆盖外部配置的值，之所以提取到外部，由于快应用也依赖这个信息配置，但其单位依旧保留 `px` 不需要转换。
* 从 `0.4.6` 版本开始，支持 设置 1px 不转，即设置 `noTrans1px: true`，将开启 1px 不转，默认为：`false`

```javascript
{
    rules: [
        {
            match: '*.styl',
            processors: [{
                name: 'postcss',
                options: {
                    plugins: {
                        px2rpx: {
                            // 设计稿尺寸
                            designWidth: 1242,
                            // 开启 1px 不转, 即有 1px 的数字不会进行转换
                            noTrans1px: true,
                            // 保留的小数点单位, 默认为 2
                            precision: 2
                            // 保持 不转 px 的注释值，默认: px2rpx: no
                            // keepComment: 'px2rpx: no'
                            // ignore(path):boolean 忽略要转换的文件
                            // ignore(path) { // ... return false;}
                        }
                    }
                }
            }]
        }
    ]
}
```

也可以通过 `processors` 选项来配置定义：

```javascript
{
    processors: {
        postcss: {
            extnames: ['styl'],
            options: {
                plugins: {
                    px2rpx: {
                        // 设计稿尺寸
                        designWidth: 1242,
                        // 开启 1px 不转
                        noTrans1px: true,
                        // 保留的小数点单位, 默认为 2
                        precision: 2
                        // 保持 不转 px 的注释值，默认: px2rpx: no
                        // keepComment: 'px2rpx: no'
                    }
                }
            }
        }
    }
}
```

## `px2rpx` 插件说明

* 参数说明：
    * `designWidth`: 设计稿的宽度，开发过程中可以直接根据实际的视觉稿的像素宽度进行设置即可
    * `precision`: 转成 `rpx` 单位保留的小数点后的位数，可选，默认为 2
    * `keepComment`: 保持某些 `px` 不转为 `rpx` 的注释内容， 可选，默认为 px2rpx: no

```css
// 开发样式定义
// 视觉稿宽度为：`1242px`
.my-btn {
    width: 822px;
    height: 150px;
}

// 经过 px2rpx 插件转换后结果
.my-btn {
    width: 496.38rpx;
    height: 90.58rpx;
}
```

* `px` 不转 `rpx` 说明:

默认不做任何说明的话，`px` 将会根据配置参数转为对应的 `rpx` 取值；
若希望某些样式不进行转换，如：`1px、2px 、3px` 等，需单独在要转的样式后添加 `/*px2rpx: no*/` 注释；

```css
// 开发样式定义
// 视觉稿宽度为：`1242px`
.my-btn {
    border: 1px solid #fff; /* px2rpx: no */
    border-radius: 3px;
    /* px2rpx: no */
    width: 822px;
    height: 150px; /* px2rpx: no */
}

// 经过 px2rpx 插件转换后样式为
.my-btn {
    border: 1px solid #fff;
    border-radius: 3px;
    width: 496.38rpx;
    height: 150px;
}
```

相应开发文件为 `.styl` 写法:

``` css
// 开发样式定义
// 视觉稿宽度为：`1242px`
.my-btn
    border: 1px solid #fff /* px2rpx: no */
    border-radius: 3px
    /* px2rpx: no */
    width: 822px
    height: 150px /* px2rpx: no */

```

还可通过 设置 `keepComment` 自由配置强制不转px的注释文案；

如： 当设置 `px2rpx.keepComment: 'no'` 时

```css
// 开发样式定义
// 视觉稿宽度为：`1242px`
.my-btn {
    border: 1px solid #fff; /* no */
    border-radius: 3px;
    /* no */
    width: 822px;
    height: 150px; /* no */
}

// 经过 px2rpx 插件转换后样式为
.my-btn {
    border: 1px solid #fff;
    border-radius: 3px;
    width: 496.38rpx;
    height: 150px;
}
```

