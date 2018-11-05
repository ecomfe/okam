<template lang="pug">
    <article class="home-wrap">
        <h1 class="page-title">{{title}}</h1>
    </article>
    view.home-wrap
        view(
            class="first-view"
        ) 测试数据渲染 #{name}!

        view(
            @click="handleClick",
            class="first-view"
        ) 测试绑定事件

        view(class="second-view {{name}}") {{title}}swan数据绑定
        view.third-view.
            content is here when content is much more

</template>
<script>
export default {
    data: {
        title: 'pug 语法格式'
    },
    methods: {
        handleClick() {
            swan.showToast({
                title: '这是测试用的toast',
                duration: 2000
            });
        }
    }
};
</script>
<style lang="stylus">
.home-wrap
    height: 100%
    min-height: 100%
    padding: 10px 20px
    background-color: #ffffff
    color: #333333
    font-size: 14px;

    .a, .b, .c, .d, .e, .f, .g
        border: 1px solid blue
        padding: 10px
    .active
        border: 1px solid cyan
        display inline
    .error
        color: red
    .text-danger
        font-weight: bold
        font-size: 20px
    .page-title
        text-align center
        font-size 28px
        font-weight bold
        padding 8px 0
    .section-title
        margin: 15px 0 10px
        font-size: 24px
        color: #145996
        border-bottom 1px solid #145996
    .content-title
        font-size: 18px
        margin: 10px 0 5px
    .code
        font-size: 12px
        padding: 5px
        background #f8f8f8
        border: 1px solid #d3d3d3
        border-radius 5px
    .backButton
        position fixed
        bottom: 20px
        right 10px
        border: 1px solid #333333
        border-radius: 50%
        height: 40px
        width: 40px
        background: no-repeat center 40% / 80% url('../../common/img/home.png') rgba(0, 0, 0, 0.2)
    .tips-container
        background #f8f8f8
        padding 5px 10px
        border-left 2px solid deeppink
        .tip-item
            font-size: 14px
    button
        border: 1px solid #eeeeee
        font-size: 12px
    .pink-style
        color: pink
    .cyan-style
        color: cyan
    .text
        font-size: 12px
    .main
        margin-top: 20px
</style>
