<input bindinput="__handlerProxy" value="{{inputVal}}" data-model-args="inputVal,value"/>
<input bindinput="__handlerProxy" value="{{modelData.input}}" data-model-args="modelData.input,value"/>
<input bindinput="__handlerProxy" value="{{modelData.arr[0]}}" data-model-args="modelData.arr[0],value"/>
<input bindinput="__handlerProxy" value="{{modelData.obj.input}}" data-model-args="modelData.obj.input,value"/>
<textarea bindinput="__handlerProxy" value="{{textareaVal}}" data-model-args="textareaVal,value"></textarea>
<picker mode="time" start="11:11" end="23:11" bindchange="__handlerProxy" value="{{timeVal}}" data-model-args="timeVal,value">
    <view class="picker">
        当前选择: {{timeVal}}
    </view>
</picker>
<checkbox-group bindchange="__handlerProxy" data-model-args="checkboxVal,value">
    <label wx:for-item="item" wx:for="{{items}}">
        <checkbox value="{{item.name}}"/>
        {{item.value}}
    </label>
</checkbox-group>
<radio-group bindchange="__handlerProxy" data-model-args="radioVal,value">
    <label wx:for-item="item" wx:for="{{items}}">
        <radio value="{{item.name}}"/>
        {{item.value}}
    </label>
</radio-group>
<switch name="switch1" type="checkbox" bindchange="__handlerProxy" checked="{{switchVal}}" data-model-args="switchVal,value"></switch>
<model-component bindchange="__handlerProxy" value="{{componentVal}}" data-model-args="componentVal,value"/>
<sp-model-component bindspchange="__handlerProxy" spvalue="{{componentVal}}" data-model-args="componentVal,valuewx"/>
