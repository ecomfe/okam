# Broadcast 支持

`Okam` 提供事件广播支持的扩展，以支持跨组件页面间通信。该功能支持要求版本为：`0.3.x` 版本以上。

**注意：** `废弃` 对于手动声明或者手动注册的广播事件监听，都不需要手动移除掉，在组件或者页面销毁时候，会自动移除掉。如果需要页面隐藏时候不监听，需要自己手动暂时移除，再次显示时候，再手动注册监听器。此外，`百度小程序` 从一个页面导航到另外一个页面，再点右上角返回时候，该页面没有被正确销毁，会导致注册广播事件监听器没有移除掉，需要自己在页面 `onHide` 钩子里把广播事件监听移除掉，如果这个问题已经修复，可以忽略。

!> `0.4.7@okam-core` 开始，新增 `$eventHub` 属性，用来实现广播事件监听移除等操作，对于快应用只提供了该属性进行广播事件操作，考虑到广播监听移除由开发者自行控制会合适些，其次快应用平台存在 `$broadcast` API 会冲突，且其含义跟扩展定义完全不同。因此，建议，开发过程中，可以直接使用 `$eventHub` 属性进行广播事件监听移除，之前方式不建议使用。

## 开启 Broadcast 支持

在构建配置 `framework` 选项里加上 `broadcast` 支持：

```
{
    framework: ['broadcast']
}
```

## ~~使用示例~~(废弃)

!> `0.4.7@okam-core` 之前版本使用方式，之前版本，快应用不支持 `broadcast` 能力。

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

## 使用示例(推荐)

!> `0.4.7@okam-core` 开始版本使用方式，快应用开始支持 `broadcast` 能力。

* Component/Page 使用

```
<template>
    <view></view>
</template>
<script>
export default {
    created() {
        // 发送广播事件
        this.$eventHub.emit('myBroadcastEvent', {msg: 'xxx'});

        // 手动监听广播事件
        let handler = () => {};
        this.$eventHub.on('myBroadcastEvent', handler);
        // 广播事件移除
        this.$eventHub.off('myBroadcastEvent', handler);
    }
};
</script>
```

* 入口脚本 app.js: 使用同组件

```javascript
export default {
    onShow() {
        // 发送广播事件
        this.$eventHub.emit('myBroadcastEvent', {msg: 'xxx'});

        // once 监听广播事件
        let handler = () => {};
        this.$eventHub.once('myBroadcastEvent', handler);
    }
}
```



