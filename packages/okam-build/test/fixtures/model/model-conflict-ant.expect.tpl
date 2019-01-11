<input value="{{input1}}" onInput="__handlerProxy" data-okam-model-args="input1,value"/>
<input value="{{input2}}" onInput="__handlerProxy" data-okam-model-args="input2,value"/>
<input value="{{input3}}" onInput="__handlerProxy" data-okam-model-args="input3,value"/>

<input catchInput="__handlerProxy" data-input-proxy="fn" data-input-args="{{['@input.once']}}" onInput="__handlerProxy" value="{{input1}}" data-okam-model-args="input1,value"/>

<input onInput="__handlerProxy" data-input-proxy="fn" data-input-args="{{['@input']}}" value="{{input1}}" data-okam-model-args="input1,value"/>

<input bindinput="fn" onInput="__handlerProxy" value="{{input3}}" data-okam-model-args="input3,value"/>

<input onInput="__handlerProxy" data-input-proxy="fn" value="{{input3}}" data-okam-model-args="input3,value"/>
