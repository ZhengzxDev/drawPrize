<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div class="app__cntr">
        <RouterView style="width:100%;height:100%" />
    </div>
</template>

<style scoped lang="scss">
.app__cntr {
    width: 100%;
    height: 100%;
    background-color: aqua;
}
</style>
