<input value="{{input1}}" bindinput="__handlerProxy" data-model-expr="input1"/>
<input value="{{input2}}" bindinput="__handlerProxy" data-model-expr="input2"/>
<input value="{{input3}}" bindinput="__handlerProxy" data-model-expr="input3"/>

<input capture-bind:input="__handlerProxy" data-input-proxy="fn" data-input-args="{{['@input.once']}}" bindinput="__handlerProxy" value="{{input1}}" data-model-expr="input1"/>

<input bindinput="__handlerProxy" data-input-proxy="fn" data-input-args="{{['@input']}}" value="{{input1}}" data-model-expr="input1"/>

<input bindinput="__handlerProxy" data-input-proxy="fn" value="{{input3}}" data-model-expr="input3"/>

<input onInput="fn" bindinput="__handlerProxy" value="{{input3}}" data-model-expr="input3"/>
