<script setup lang="ts">
const props = defineProps<{
    properties: Record<string, unknown>;
}>();

const date = new Date(props.properties.date as string);

const dateFormated = date.toISOString().split('T')[0];
</script>

<template>
    <div class="popup">
        <span class="block text-xs/6 italic">{{ properties.id }}</span>
        <span class="block font-semibold">{{ properties.title }}</span>
        <span class="block">{{ properties.description }}</span>
        <span class="block"><b>Type:</b> {{ properties.category }}</span>
        <span class="block"><b>Date:</b> {{ dateFormated }}</span>
    </div>
</template>
