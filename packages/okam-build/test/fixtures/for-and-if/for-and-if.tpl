<view for="item,index in [false,true,false]" if="item" hello="hello">
    <div>
        <span>hello im from for and if</span>
    </div>
    <div>
        <span>hello im from for and if</span>
    </div>
    hello im from for and if
</view>

<view if="3>4">text</view>
<view else-if="3>2" for="item,index in [1,2]" hello="hello">
    <span>else-if text::{{item}}</span>
</view>
<view else for="item,index in [3,4]">else text:: {{item}}</view>

<view if="3>4">text</view>
<view elif="3>2" for="item,index in [1,2]" hello="hello">
    <span>else-if text</span>
    hello im from for and if
</view>
<view else for="item,index">else text</view>

<view if="3>4">text</view>
<view elif="3>5" for="item,index in [1,2]" hello="hello">
    <span>else-if text</span>
    hello im from for and if
</view>
<view else for="item,index">else text</view>
