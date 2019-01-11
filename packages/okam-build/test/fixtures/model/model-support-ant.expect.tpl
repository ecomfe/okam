<input onInput="__handlerProxy" value="{{inputVal}}" data-okam-model-args="inputVal,value"/>
<input onInput="__handlerProxy" value="{{modelData.input}}" data-okam-model-args="modelData.input,value"/>
<input onInput="__handlerProxy" value="{{modelData.arr[0]}}" data-okam-model-args="modelData.arr[0],value"/>
<input onInput="__handlerProxy" value="{{modelData.obj.input}}" data-okam-model-args="modelData.obj.input,value"/>
<textarea onInput="__handlerProxy" value="{{textareaVal}}" data-okam-model-args="textareaVal,value"></textarea>
<picker mode="time" start="11:11" end="23:11" onChange="__handlerProxy" value="{{timeVal}}" data-okam-model-args="timeVal,value">
    <view class="picker">
        当前选择: {{timeVal}}
    </view>
</picker>
<checkbox-group onChange="__handlerProxy" data-okam-model-args="checkboxVal,value">
    <label a:for-item="item" a:for="{{items}}">
        <checkbox value="{{item.name}}"/>
        {{item.value}}
    </label>
</checkbox-group>
<radio-group onChange="__handlerProxy" data-okam-model-args="radioVal,value">
    <label a:for-item="item" a:for="{{items}}">
        <radio value="{{item.name}}"/>
        {{item.value}}
    </label>
</radio-group>
<switch name="switch1" type="checkbox" onChange="__handlerProxy" checked="{{switchVal}}" data-okam-model-args="switchVal,value"></switch>
<model-component onChange="__handlerProxy" value="{{componentVal}}" data-okam-model-args="componentVal"/>
<sp-model-component onSpchange="__handlerProxy" spvalue="{{componentVal}}" data-okam-model-args="componentVal,valueant"/>
