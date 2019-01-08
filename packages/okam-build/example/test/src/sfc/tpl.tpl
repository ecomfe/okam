<import src="../common/tpl/footer.tpl" />
<view class="home-wrap">
    <image class="page-img" src="../common/img/okm.png" />
    <hello :from="from" @hello="handleHello"></hello>
    <view class="click-tip" if="clicked">You click me~</view>
</view>
<tpl is="page-footer" />
