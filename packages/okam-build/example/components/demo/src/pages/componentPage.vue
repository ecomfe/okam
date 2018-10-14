<template>
    <view class="comp-page">
        <view class="title">原生自定义组件引入</view>
        <origin-npm-dep-comp out-text="依赖 min-component 包 其中的包内依赖了 min-component2 包的 组件">
        </origin-npm-dep-comp>
        <origin-npm-local-dep-comp out-text="依赖 min-component 包 其中的包内依赖了 min-component 本地包的 组件">
        </origin-npm-local-dep-comp>
        <origin-npm-comp out-text="依赖 min-component 包 其中的包内无依赖的 组件1">
        </origin-npm-comp>
        <origin-npm-comp-other out-text="依赖 min-component 包 其中的包内无依赖的 同目录组件2">
        </origin-npm-comp-other>
        <origin-comp out-text="依赖 本项目中 原生的组件">
        </origin-comp>
    </view>
</template>

<script>
import OriginNpmDepComp from 'min-component/components/DepNpmComp/Comp';
import OriginNpmComp from 'min-component/components/NoDepComp/Comp';
import OriginNpmLocalDepComp from 'min-component/components/DepComp/Comp';
import OriginNpmCompOther from 'min-component/components/NoDepComp/CompOther';
import OriginNpmWxComp from 'min-component/components/WxComp/Comp';
import OriginComp from '../components/OriginComponent/Comp';

export default {
    config: {
        navigationBarTitleText: '自定义组件示例'
    },

    components: {
        OriginNpmDepComp,
        OriginNpmComp,
        OriginNpmLocalDepComp,
        OriginNpmCompOther,
        OriginNpmWxComp,
        OriginComp
    },

    data: {
    },

    methods: {
    }
};
</script>

<style lang="css">
.title {
    display: block;
    width: 100%;
    color: #f00;
    font-size: 20px;
    text-align: center;
}


</style>
