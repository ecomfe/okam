<template>
    <view class="todo-wrap">
        <view class="todo-title">Todo List: {{otherNum}}</view>
        <radio-group class="todo-filter" @change="onFilterChange">
            <label class="filter-item" for="item in filterItems">
                <radio :value="item.value"
                    :checked="item.checked"
                    color="#ff0000" />
                {{item.name}}
            </label>
        </radio-group>
        <button plain class="add-todo-btn" @click="onAddTodo">增加 Todo</button>
        <view class="todo-list">
            <view class="todo-item new-item" if="addNew">
                <input focus="true" placeholder="输入 Todo 项内容" type="text"
                    class="todo-input" @blur="onInputDone" @confirm="onInputDone"/>
            </view>
            <view class="empty-tip" if="!filterList.length">无</view>
            <view @click="onToggleDone(item.id)" for="item, index in filterList"
                :class="[item.completed ? 'done' : '', 'todo-item']" else>
                <text class="todo-content">{{item.text}}</text>
                <icon size="16" class="op-btn" type="clear" @click.stop="onRemoveTodo(item.id)"/>
            </view>
        </view>

        <view>
            <view><text>counter: {{counter}}</text></view>
            <button plain class="add-counter-btn" @click="onAddCounter">Add counter</button>
            <button @click="gotoCounter">Goto Counter</button>
        </view>
    </view>
</template>

<script>
import todoActions from '../../actions/index';

const SHOW_ALL = 1;
const SHOW_DONE = 2;
const SHOW_UNDONE = 3;

export default {
    config: { // The page config defined in page.json
        navigationBarTitleText: 'Todos',
        backgroundColor: '#fff'
    },

    data: {
        obj: {},
        num: 3,
        count: 0,
        addNew: false,
        filterItems: [
            {name: '全部', value: SHOW_ALL, checked: true},
            {name: '已完成', value: SHOW_DONE},
            {name: '未完成', value: SHOW_UNDONE}
        ],
        filterType: SHOW_ALL
    },

    computed: {
        myNum() {
            return 10 + this.num;
        },

        filterList() {
            let filterType = this.filterType;
            if (filterType === SHOW_ALL) {
                return this.todos;
            }

            let showDone = filterType === SHOW_DONE;
            return this.todos.filter(item => {
                let completed = item.completed;
                return showDone ? completed : !completed;
            });
        }
    },

    $store: {
        computed: {
            todos: 'todos',
            counter: 'counter',
            otherNum(state) {
                return state.todos.length + this.myNum + this.num;
            }
        },
        actions: [
            todoActions,
            {
                'toggle': 'toggleTodo',
                'removeTodo': 'removeTodo',
                'addTodo': 'addTodo',
                addCounter(value = 1) {
                    console.log('add', value)
                    return {type: 'INCREMENT', value};
                }
            }
        ]
    },

    created() {
        // this.getTodoList(2, 20);
        let state = this.$store.getState();
        console.log(state);
    },

    onShow() {
        // this.$fireStoreChange();
        this.oldTodos = this.$store.getState().todos;
        this.oldTodos.kkk  = 33;
        console.log('before', this.todos, this.oldTodos === this.todos);
        this.$fireStoreChange();
        console.log('after', this.todos, this.oldTodos === this.todos);

        setTimeout(() => {
            console.log('before', this.todos, this.oldTodos === this.todos);
        }, 30);

        let newObj = {a: 3};
        this.setData({obj: newObj}, () => {
            console.log('after done newObj', newObj, newObj === this.data.obj);
        });
        console.log('before done newObj', newObj, this.data.obj, newObj === this.data.obj);
    },

    methods: {
        onToggleDone(id) {
            this.oldTodos = this.$store.getState().todos;
            console.log('before toggle done', this.todos, this.oldTodos === this.data.todos)
            this.toggle(id);
            console.log('after toggle done', this.todos, this.oldTodos === this.data.todos)
            setTimeout(() => {
                console.log('after toggle success', this.todos, this.oldTodos === this.data.todos)
            }, 300)
        },

        onAddTodo() {
            this.addNew = true;
        },

        onRemoveTodo(id) {
            this.removeTodo(id);
        },

        onFilterChange(e) {
            let filterType = e.detail.value;
            this.filterType = +filterType;
        },

        onInputDone(e) {
            if (!this.addNew) {
                return;
            }

            let value = e.detail.value.trim();

            this.addNew = false;
            if (!value) {
                return;
            }

            this.addTodo(value);
        },

        onAddCounter() {
            this.addCounter(23);
        },

        gotoCounter() {
            this.$api.navigateTo({
                url: '/pages/todos/counter'
            });
        }
    }
};
</script>
<style lang="stylus">
.todo-wrap
    min-height: 100vh
    padding: 20px
    box-sizing: border-box
    background: #ccc

    .todo-title
        font-size: 16px
        font-weight: 600
        padding: 20px
        text-align: center

    .todo-filter
        margin-bottom: 20px
        display: flex
        .filter-item
            flex: 1
        .filter-text
            text-align: right

    .add-todo-btn
        margin: 10px 0

    .todo-input
        width: 100%

    .todo-list
        padding: 20px 0
        background: #fff

    .todo-item
        display: flex
        padding: 20px
        margin: 20px
        border: 1px solid #ccc
        color: #7676ea
        &.done
            color: #ccc

        &.new-item
            box-shadow: 1px 3px 8px 1px #a8a8f3

        .op-btn
            vertical-align: middle

    .todo-content
        flex: 1

    .empty-tip
        padding: 10px
        color: #ccc
        font-size: 12px

</style>
