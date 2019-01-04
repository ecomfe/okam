<view class="hello" v-if="{{2+1>3}}" ife="userAttr">hello</view>
<view v-elif="{{3/2>1}}">world</view>
<view v-else-if="{{3/2>1}}">world</view>
<view v-else>goodbye</view>
<view class="hello" if="{{2+1>3}}" ife="userAttr">hello</view>
<view elif="{{3/2>1}}">world</view>
<view else-if="{{3/2>1}}">world</view>
<view else>goodbye</view>
<view class="hello" v-bind:class="a" :class="b" ife="userAttr">hello</view>
