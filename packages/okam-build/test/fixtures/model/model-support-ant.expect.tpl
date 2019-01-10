<input onInput="__handlerProxy" value="{{inputVal}}" data-model-expr="inputVal"/>
<input onInput="__handlerProxy" value="{{modelData.input}}" data-model-expr="modelData.input"/>
<input onInput="__handlerProxy" value="{{modelData.arr[0]}}" data-model-expr="modelData.arr[0]"/>
<input onInput="__handlerProxy" value="{{modelData.obj.input}}" data-model-expr="modelData.obj.input"/>
<textarea onInput="__handlerProxy" value="{{textareaVal}}" data-model-expr="textareaVal"></textarea>
<picker mode="time" start="11:11" end="23:11" onChange="__handlerProxy" value="{{timeVal}}" data-model-expr="timeVal">
    <view class="picker">
        当前选择: {{timeVal}}
    </view>
</picker>
<checkbox-group onChange="__handlerProxy" data-model-expr="checkboxVal">
    <label a:for-item="item" a:for="{{items}}">
        <checkbox value="{{item.name}}"/>
        {{item.value}}
    </label>
</checkbox-group>
<radio-group onChange="__handlerProxy" data-model-expr="radioVal">
    <label a:for-item="item" a:for="{{items}}">
        <radio value="{{item.name}}"/>
        {{item.value}}
    </label>
</radio-group>
<switch name="switch1" type="checkbox" onChange="__handlerProxy" checked="{{switchVal}}" data-model-expr="switchVal"></switch>
<model-component onChange="__handlerProxy" value="{{componentVal}}" data-model-expr="componentVal"/>
