<template>
    <view class="text-component-wrap">
        <text :selectable="selectable" :space="space" :decode="decode">{{text}}</text>
        <button @click="addLine">add line</button>
        <button @click="toggleSelectable">Toggle Selectable</button>
        <button @click="toggleSpace">Toggle Space</button>
        <button @click="toggleDecode">Toggle Decode</button>
        <text>
            {{text}}
            <text>
                {{childText}}
            </text>
        </text>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Text Component'
    },

    data: {
        selectable: false,
        space: false,
        decode: false,
        childText: 'child text',
        text: 'this is    first line\nthis  <input>   is second line;\n &nbsp; &lt;input&gt; &amp; &apos; &ensp; &emsp;'
    },

    methods: {
        addLine() {
            this.text += '\n' + Date.now();
        },
        toggleSelectable() {
            this.selectable = !this.selectable;
        },
        toggleSpace() {
            this.space = !this.space;
        },
        toggleDecode() {
            this.decode = !this.decode;
        }
    }
};
</script>
<style lang="stylus">
.text-component-wrap
    padding: 20px
    background: #fff

</style>
