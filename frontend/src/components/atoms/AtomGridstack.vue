<script setup lang="ts">
import { onMounted } from 'vue';
import { GridStack } from 'gridstack';

onMounted(() => {
    const grid = GridStack.init({
        margin: 5,
        cellHeight: 80,
    });
});
</script>

<template>
    <div class="grid-stack"></div>
</template>
