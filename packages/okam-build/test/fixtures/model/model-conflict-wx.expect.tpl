<input value="{{input1}}" bindinput="__handlerProxy" data-okam-model-args="input1,value"/>
<input value="{{input2}}" bindinput="__handlerProxy" data-okam-model-args="input2,value"/>
<input value="{{input3}}" bindinput="__handlerProxy" data-okam-model-args="input3,value"/>

<input capture-bind:input="__handlerProxy" data-input-proxy="fn" data-input-args="{{['@input.once']}}" bindinput="__handlerProxy" value="{{input1}}" data-okam-model-args="input1,value"/>

<input bindinput="__handlerProxy" data-input-proxy="fn" data-input-args="{{['@input']}}" value="{{input1}}" data-okam-model-args="input1,value"/>

<input bindinput="__handlerProxy" data-input-proxy="fn" value="{{input3}}" data-okam-model-args="input3,value"/>

<input onInput="fn" bindinput="__handlerProxy" value="{{input3}}" data-okam-model-args="input3,value"/>
