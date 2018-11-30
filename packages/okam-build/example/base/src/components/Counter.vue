<template>
    <view class="counter-wrap">
        <view>{{from}} - {{counterFrom}}</view>
        <view>userInfo: {{userInfo.name}} - {{userInfo.age}}</view>
        <view class="counter-title">Counter: {{counter}}-{{txt}}</view>
        <button plain class="counter-btn" @click="onAddCounter">增加 Counter</button>
        <button plain class="counter-btn" @click="onMinusCounter">减少 Counter</button>
        <button plain class="userinfo-btn" @click="onUpdateUserInfo">UpdateUserInfo</button>
    </view>
</template>

<script>

export default {
    props: {
        from: String,
        txt: {
            type: String,
            default: 'abctxt'
        }
    },
    data: {
    },

    computed: {
        counterFrom() {
            return this.from + '-computed';
        }
    },

    watch: {
        counter(old, newVal) {
            console.log('watch counter change...', old, newVal);
        }
    },

    $store: {
        computed: {
            counter: 'counter',
            userInfo: function (state) {
                console.log('recompute userinfo..')
                return state.userInfo;
            }
        },
        actions: {
            addCounter(value = 1) {
                console.log('add', value)
                return {type: 'INCREMENT', value};
            },
            minusCounter(value = 1) {
                return {type: 'DECREMENT', value};
            },
            upUserInfo(info) {
                return Object.assign({}, info, {type: 'upUserInfo'});
            },
            fetchUserInfo() {
                return (dispatch, getState) => {

                    return new Promise((resolve, reject) => {

                        setTimeout(() => {
                            console.log('resolve');
                            dispatch({type: 'upUserInfo', name: 'jack', age: 666});
                            resolve();
                        }, 3000);
                    });

                    return fetchTodoList(pageNo, pageSize).then(
                        res => {
                            dispatch({type: FETCH_TODOS, todos: res});
                        },
                        err => {
                            dispatch({type: FETCH_TODOS, isFail: true, err});
                        }
                    );
                };
            }
        }
    },

    watch: {
        userInfo: {
            handler() {
                console.log('userinfo change', arguments);
            },
            deep: true
        }
    },

    created() {
        let state = this.$store.getState();
        console.log('created counter', state);
    },

    methods: {
        onAddCounter() {
            this.addCounter(5);
            this.$emit('counterChange', this.counter);
        },

        onMinusCounter() {
            this.minusCounter();
            this.$emit('counterChange', this.counter);
        },

        onUpdateUserInfo() {
            // this.upUserInfo({name: 'jack', age: 34});
            this.fetchUserInfo();
        }
    }
};
</script>
<style lang="stylus">
.counter-wrap
    .counter-title
        font-size: 16px
        font-weight: 600
        padding: 20px
        text-align: center

    .counter-btn,
    .userinfo-btn
        margin: 20px 0

</style>
