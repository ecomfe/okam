<input bindinput="__handlerProxy" value="{{inputVal}}" data-model-expr="inputVal"/>
<input bindinput="__handlerProxy" value="{{modelData.input}}" data-model-expr="modelData.input"/>
<input bindinput="__handlerProxy" value="{{modelData.arr[0]}}" data-model-expr="modelData.arr[0]"/>
<input bindinput="__handlerProxy" value="{{modelData.obj.input}}" data-model-expr="modelData.obj.input"/>
<textarea bindinput="__handlerProxy" value="{{textareaVal}}" data-model-expr="textareaVal"></textarea>
<picker mode="time" start="11:11" end="23:11" bindchange="__handlerProxy" value="{{timeVal}}" data-model-expr="timeVal">
    <view class="picker">
        当前选择: {{timeVal}}
    </view>
</picker>
<checkbox-group bindchange="__handlerProxy" data-model-expr="checkboxVal">
    <label wx:for-item="item" wx:for="{{items}}">
        <checkbox value="{{item.name}}"/>
        {{item.value}}
    </label>
</checkbox-group>
<radio-group bindchange="__handlerProxy" data-model-expr="radioVal">
    <label wx:for-item="item" wx:for="{{items}}">
        <radio value="{{item.name}}"/>
        {{item.value}}
    </label>
</radio-group>
<switch name="switch1" type="checkbox" bindchange="__handlerProxy" checked="{{switchVal}}" data-model-expr="switchVal"></switch>
<model-component bindchange="__handlerProxy" value="{{componentVal}}" data-model-expr="componentVal"/>
