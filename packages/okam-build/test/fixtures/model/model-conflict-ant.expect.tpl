<input value="{{input1}}" onInput="__handlerProxy" data-model-expr="input1"/>
<input value="{{input2}}" onInput="__handlerProxy" data-model-expr="input2"/>
<input value="{{input3}}" onInput="__handlerProxy" data-model-expr="input3"/>

<input catchInput="__handlerProxy" data-input-proxy="fn" data-input-args="{{['@input.once']}}" onInput="__handlerProxy" value="{{input1}}" data-model-expr="input1"/>

<input onInput="__handlerProxy" data-input-proxy="fn" data-input-args="{{['@input']}}" value="{{input1}}" data-model-expr="input1"/>

<input bindinput="fn" onInput="__handlerProxy" value="{{input3}}" data-model-expr="input3"/>

<input onInput="__handlerProxy" data-input-proxy="fn" value="{{input3}}" data-model-expr="input3"/>
