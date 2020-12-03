<template>
    <div class="api-storage-wrapper">
        <div>setStorageSync： {{ originData.key }}: {{ originData.value }}</div>
        <div>getStorageSync： {{ valueFromStorage }}</div>

        <button @click="handleSetStorageSyncClick">存储</button>
        <button @click="handleGetStorageSyncClick">读取</button>
    </div>
</template>
<script>
export default {
    config: {
        title: 'StorageAPI'
    },

    data () {
        return {
            originData: {
                key: '示例Key',
                value: '示例Value'
            },
            valueFromStorage: ''
        }
    },

    methods: {
        handleSetStorageSyncClick () {
            this.$api.setStorageSync(this.originData.key, this.originData.value);
        },
        handleGetStorageSyncClick () {
            this.valueFromStorage = this.$api.getStorageSync(this.originData.key);
        }
    }
};
</script>
<style lang="stylus">
.api-storage-wrapper
    padding: 20px
    background: #fff
</style>
