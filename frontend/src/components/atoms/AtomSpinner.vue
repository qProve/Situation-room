<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        color?: string;
        size: string;
    }>(),
    {
        color: '#ffffff',
    },
);
</script>

<template>
    <div class="fa-solid fa-spinner animate-spin" :class="[size]" :style="{ color: color }"></div>
</template>
