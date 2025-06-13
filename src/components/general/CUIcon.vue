<template>
    <div class="cuicon__cntr" :style="{
        height: props.size.toString() + 'px',
        width: props.size.toString() + 'px',
        fill: props.color,
    }">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
    size: {
        type: Number,
        default: 15,
    },
    color: {
        type: String,
        default: '#000000',
    },
});
</script>

<style scoped lang="scss">
.cuicon__cntr {
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.cuicon__cntr svg {
    width: 100%;
    height: 100%;
    display: block;
}
</style>
