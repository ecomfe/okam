<template>
    <view class="vant-weapp-page">
        <view>
            <van-button ref="btn" type="primary" @click="handleClick">按钮</van-button>
        </view>
        <view>
            <van-cell-group>
                <van-field
                    :value="userName"
                    placeholder="请输入用户名"
                    :border="false"
                    @change="handleInputChange"
                />
            </van-cell-group>
        </view>
    </view>
</template>

<script>
import button from 'vant-weapp/dist/button';
import fieldInput from 'vant-weapp/dist/field';
import cellGroup from 'vant-weapp/dist/cell-group';

export default {
    config: {
        title: '有赞UI组件'
    },

    components: {
        'van-button': button,
        'van-input': fieldInput,
        'van-cell-group': cellGroup
    },

    data: {
        useName: '小李子'
    },

    mounted() {
        console.log('mounted', this.$refs.btn)
    },

    methods: {
        handleClick() {
            console.log('click', arguments);
            console.log(this)
        },

        handleInputChange() {
            console.log('input changes', arguments);
        }
    }
};
</script>

<style lang="stylus">
.vant-weapp-page
    margin: 20px
    padding: 20px
</style>
