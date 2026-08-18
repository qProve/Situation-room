<script setup lang="ts">
import { useEventsStore } from '@/stores/events.store';
import type { Feature, Point, Polygon } from 'geojson';
import { computed, onMounted, watch } from 'vue';
import AtomMap from '../atoms/AtomMap.vue';

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
    <div class="relative h-screen w-screen">
        <AtomMap :features="features" />
    </div>
</template>
