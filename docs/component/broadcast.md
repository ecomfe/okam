# Broadcast 支持

`Okam` 提供事件广播支持的扩展，以支持跨组件页面间通信。该功能支持要求版本为：`0.3.x` 版本以上。

**注意：** 对于手动声明或者手动注册的广播事件监听，都不需要手动移除掉，在组件或者页面销毁时候，会自动移除掉。如果需要页面隐藏时候不监听，需要自己手动暂时移除，再次显示时候，再手动注册监听器。

## 开启 Broadcast 支持

在构建配置 `framework` 选项里加上 `broadcast` 支持：

```
{
    framework: ['broadcast']
}
```

## 使用示例

* Component/Page 使用

```Page/Component
<template>
    <view></view>
</template>
<script>
export default {
    broadcastEvents: {
        'eventA': function (e) {
            // 监听广播事件，该监听器上下文为当前组件或页面
        },

        'eventA.once': function (e) {
            // 监听广播事件，只监听一次，该监听器上下文为当前组件或页面
        }
    },

    created() {
        // 发送广播事件
        this.$broadcast('myBroadcastEvent', {msg: 'xxx'});

        // 手动监听广播事件
        let handler = () => {}; // 注意：该 handler 上下文非组件或者页面
        this.$onBroadcast('myBroadcastEvent', handler);
        // 广播事件移除
        this.$offBroadcast('myBroadcastEvent', handler);
    }
};
</script>
```

* 入口脚本 app.js: 使用同组件

```app.js
export default {
    broadcastEvents: {
        'eventA': function (e) {
            // 监听广播事件
        },

        'eventA.once': function (e) {
            // 监听广播事件，只监听一次
        }
    },

    onShow() {
        // 发送广播事件
        this.$broadcast('myBroadcastEvent', {msg: 'xxx'});

        // 手动监听广播事件
        let handler = () => {};
        this.$onBroadcast('myBroadcastEvent', handler);
        // 广播事件移除
        this.$offBroadcast('myBroadcastEvent', handler);
    }
}
```


