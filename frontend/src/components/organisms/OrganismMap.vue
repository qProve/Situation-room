<script setup lang="ts">
import { computed } from 'vue';
import AtomMap from '../atoms/AtomMap.vue';
import OrganismMapControlPanel from './OrganismMapControlPanel.vue';
import { sourceRegistry } from '@/sources/index.ts';

const sources = sourceRegistry.map((source) => ({
    source,
    store: source.useStore(),
}));

const sourcesWithFeatures = computed(() =>
    sources.map(({ source, store }) => ({
        source,
        features: (store.filteredFeatures as unknown[]).map(source.normalize),
    })),
);

const activeError = computed(() => {
    for (const { store } of sources) {
        if (store.error) return store.error;
    }
    return null;
});
</script>

<template>
    <div class="relative h-full w-full">
        <AtomMap :sources="sourcesWithFeatures" />

        <OrganismMapControlPanel />

        <Transition name="fade">
            <div
                v-if="activeError"
                class="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
            >
                <span class="text-red-400 text-lg">{{ activeError }}</span>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
