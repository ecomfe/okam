<input bindinput="__handlerProxy" value="{{inputVal}}" data-okam-model-args="inputVal,value"/>
<input bindinput="__handlerProxy" value="{{modelData.input}}" data-okam-model-args="modelData.input,value"/>
<input bindinput="__handlerProxy" value="{{modelData.arr[0]}}" data-okam-model-args="modelData.arr[0],value"/>
<input bindinput="__handlerProxy" value="{{modelData.obj.input}}" data-okam-model-args="modelData.obj.input,value"/>
<textarea bindinput="__handlerProxy" value="{{textareaVal}}" data-okam-model-args="textareaVal,value"></textarea>
<picker mode="time" start="11:11" end="23:11" bindchange="__handlerProxy" value="{{timeVal}}" data-okam-model-args="timeVal,value">
    <view class="picker">
        当前选择: {{timeVal}}
    </view>
</picker>
<checkbox-group bindchange="__handlerProxy" data-okam-model-args="checkboxVal,value">
    <label s-for="item in items">
        <checkbox value="{{item.name}}"/>
        {{item.value}}
    </label>
</checkbox-group>
<radio-group bindchange="__handlerProxy" data-okam-model-args="radioVal,value">
    <label s-for="item in items">
        <radio value="{{item.name}}"/>
        {{item.value}}
    </label>
</radio-group>
<switch name="switch1" type="checkbox" bindchange="__handlerProxy" checked="{{switchVal}}" data-okam-model-args="switchVal,checked"></switch>
<model-component bindchange="__handlerProxy" value="{{componentVal}}" data-okam-model-args="componentVal"/>
<sp-model-component bindspchange="__handlerProxy" spvalue="{{componentVal}}" data-okam-model-args="componentVal,valueswan"/>
