<script setup lang="ts">
import type { NormalizedProperties } from '@/types/normalized.type';
import { computed } from 'vue';

const props = defineProps<{
    properties: NormalizedProperties;
}>();

const categoryFormatted =
    props.properties.category[0]?.toUpperCase() + props.properties.category.slice(1);

const extra = computed(() => {
    if (!props.properties.extra) return {};
    if (typeof props.properties.extra === 'string') {
        return JSON.parse(props.properties.extra) as Record<string, unknown>;
    }

    return props.properties.extra;
});
</script>

<template>
    <div
        class="bg-white/10 backdrop-blur border border-white/10 rounded-lg p-3 min-w-48 max-w-64 shadow-xl"
    >
        <span class="block text-xs text-white italic mb-1">{{ properties.id }}</span>
        <span class="block text-sm font-semibold text-white mb-2">{{ properties.title }}</span>

        <div v-if="properties.description" class="text-xs text-white mb-2">
            {{ properties.description }}
        </div>

        <div class="border-t border-white/10 pt-2 space-y-1">
            <div class="flex justify-between gap-4 text-xs">
                <span class="text-white">Category</span>
                <span class="text-white">{{ categoryFormatted }}</span>
            </div>
            <div class="flex justify-between gap-4 text-xs">
                <span class="text-white">Date</span>
                <span class="text-white">{{ properties.date }}</span>
            </div>
            <template v-for="(value, key) in extra">
                <div v-if="value" class="flex justify-between gap-4 text-xs">
                    <span class="text-white capitalize">{{ key }}</span>
                    <span class="text-white">{{ value }}</span>
                </div>
            </template>
        </div>

        <a
            :href="properties.link"
            target="_blank"
            class="mt-2 block text-xs text-blue-400 hover:text-blue-300 underline text-right transition-colors"
        >
            View detail ↗
        </a>
    </div>
</template>
