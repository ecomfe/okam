<view class="home-wrap">
    <import src="../../common/tpl/footer.tpl" />
    <image class="page-img" src="../../common/img/okm.png" />
    <hello :from="from" @hello="handleHello"></hello>
    <view class="click-tip" if="clicked">You click me~</view>
    <tpl is="page-footer" />
</view>
