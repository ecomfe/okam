<template>
    <view class="filter-wrap">
        <view>raw: {{str}}, filter: {{str | toUpperCase}}</view>
        <filter-component :from="str|toUpperCase"></filter-component>
    </view>
</template>

<script>
import FilterComponent from './FilterComponent';

export default {
    config: {
        title: 'Filter 支持'
    },

    components: {
        FilterComponent
    },

    data: {
        str: 'abc3r23'
    },

    filters: {
        toUpperCase(str2) {
            return str2.toUpperCase();
        }
    },

    methods: {
    }
};
</script>

<style lang="stylus">
.filter-wrap
    height: 100vh
    padding: 10px
    background: #fff

</style>
