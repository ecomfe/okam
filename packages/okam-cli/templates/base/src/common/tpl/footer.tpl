<% if: ${template} === 'pug' %>
template(name='page-footer')
    view.page-footer
        text footer
<% else %>
<template name="page-footer">
    <view class="page-footer">
        <text>footer</text>
    </view>
</template>
<% /if %>
