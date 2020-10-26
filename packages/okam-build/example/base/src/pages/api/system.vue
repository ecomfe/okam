<template>
    <div class="api-system-wrapper">
        <div
            v-for="item in Object.keys(systemInfo)"
            :key="item"
        >
            {{item}}: {{ systemInfo[item] }}
        </div>
        <button @click="handleGetSystemInfoClick">getSystemInfo</button>
        <button @click="handleGetSystemInfoSyncClick">getSystemInfoSync</button>
    </div>
</template>
<script>
export default {
    config: {
        title: 'SystemAPI'
    },

    data () {
        return {
            systemInfo: {
                brand: '',
                model: '',
                system: '',
                version: '',
                pixelRatio: '',
                screenWidth: '',
                screenHeight: '',
                windowHeight: '',
                windowWidth: ''
            }
        }
    },

    methods: {
        handleGetSystemInfoClick () {
            this.$api.getSystemInfo({
                success: (res) => {
                    Object.assign(this.systemInfo, res);
                }
            });
        },
        handleGetSystemInfoSyncClick () {
            Object.assign(this.systemInfo, this.$api.getSystemInfoSync());
        }
    }
};
</script>
<style lang="stylus">
.api-system-wrapper
    padding: 20px
    background: #fff
</style>
