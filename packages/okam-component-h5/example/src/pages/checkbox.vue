<template>
    <div class="component-container">
        <div class="card-area">
            <div class="top-description border-bottom">默认样式</div>
            <label class="block border-bottom">
                <checkbox checked>多选项一</checkbox>
            </label>
            <label class="block border-bottom">
                <checkbox>多选项二</checkbox>
            </label>
        </div>
    </div>
</template>

<script>
import Checkbox from 'okam/Checkbox';
export default {
    components: {
        Checkbox
    }
};
</script>
