<script setup lang="ts">
import { useEventsStore } from '@/stores/events.store';
import type { Feature, Point, Polygon } from 'geojson';
import { computed, onMounted, watch } from 'vue';
import AtomMap from '../atoms/AtomMap.vue';
import AtomSpinner from '../atoms/AtomSpinner.vue';

const eventsStore = useEventsStore();

const features = computed<Feature<Point | Polygon>[]>(() =>
    eventsStore.features.map((f) => ({
        ...f,
        properties: {
            ...f.properties,
            category: f.properties.categories[0]?.id ?? 'unknown',
        },
    })),
);

watch(
    () => eventsStore.features,
    (val) => {},
);

onMounted(() => {
    eventsStore.fetch();
});
</script>

<template>
    <div class="relative h-full w-full">
        <AtomMap :features="features" />

        <Transition name="fade">
            <div
                v-if="eventsStore.isLoading"
                class="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
            >
                <AtomSpinner />
            </div>
        </Transition>

        <Transition name="fade">
            <div
                v-if="eventsStore.error"
                class="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
            >
                <span class="text-red-400 text-lg">{{ eventsStore.error }}</span>
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
