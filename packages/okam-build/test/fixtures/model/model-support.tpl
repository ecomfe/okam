<input v-model="inputVal" />
<input v-model="modelData.input" />
<input v-model="modelData.arr[0]" />
<input v-model="modelData.obj.input" />
<textarea v-model="textareaVal"></textarea>
<picker
    v-model="timeVal"
    mode="time"
    start="11:11"
    end="23:11">
    <view class="picker">
        当前选择: {{timeVal}}
    </view>
</picker>
<checkbox-group v-model="checkboxVal">
    <label for="item in items">
        <checkbox :value="item.name"/>
        {{item.value}}
    </label>
</checkbox-group>
<radio-group v-model="radioVal">
    <label v-for="item in items">
        <radio :value="item.name"/>
        {{item.value}}
    </label>
</radio-group>
<switch name="switch1" v-model="switchVal" type="checkbox"></switch>
<model-component v-model="componentVal" />
<sp-model-component v-model="componentVal" />
