<template>
    <article class="home-wrap">
        <h1 class="page-title">分包页面A</h1>
        <div class="container">主体</div>
        <comp1></comp1>
    </article>
</template>
<script>
import {isCheck} from '../../../common/js/test';
import {map} from 'lodash';
import comp1 from '../../../components/comp1';
export default {
    config: {
        navigationBarTitleText: 'Hello Okam Smart Program',
        backgroundColor: '#fff'
    },
    data: {},
    components: {
        comp1
    },
    created() {
        const users = [
            {'user': 'barney'},
            {'user': 'fred'}
        ];
        const result = map(users, 'user');
        console.log('[确认分包依赖]lodash>>>', result);
        this.$api.showToast({
            title: '123',
            duration: 3000
        });
    }
};
</script>
<style lang="stylus">
@import '../../../common/css/a.css';
html, body
    font-size: 14px;
    height: 100%
    min-height: 100%
    background-color: #ffffff
    color: #333333
</style>
