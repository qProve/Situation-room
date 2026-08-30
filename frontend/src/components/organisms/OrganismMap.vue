<script setup lang="ts">
import { useEonetStore } from '@/stores/eonet.store.ts';
import type { Feature, Point, Polygon } from 'geojson';
import { computed, onMounted } from 'vue';
import AtomMap from '../atoms/AtomMap.vue';
import AtomSpinner from '../atoms/AtomSpinner.vue';
import OrganismMapControlPanel from './OrganismMapControlPanel.vue';
import { useUsgsStore } from '@/stores/usgs.store.ts';
import type { NormalizedFeature } from '@/types/normalized.type.ts';

const eonetStore = useEonetStore();
const usgsStore = useUsgsStore();

onMounted(() => {
    eonetStore.fetch();
    usgsStore.fetch();
});

const normalizedFeatures = computed((): NormalizedFeature[] => {
    const eonet: NormalizedFeature[] = eonetStore.filteredFeatures.map((f) => ({
        ...f,
        properties: {
            id: f.properties.id,
            title: f.properties.title,
            category: f.properties.categories[0]?.id ?? 'unknown',
            link: f.properties.link,
            closed: f.properties.closed,
            date: f.properties.date,
            magnitudeValue: f.properties.magnitudeValue,
            magnitudeUnit: f.properties.magnitudeUnit,
        },
    }));
    
    const usgs: NormalizedFeature[] = usgsStore.filteredFeatures.map((f) => ({
        ...f,
        properties: {
            id: f.id as string,
            title: f.properties.title,
            category: f.properties.type ?? 'unknown',
            time: f.properties.time,
            mag: f.properties.mag,
            place: f.properties.place,
            link: f.properties.url,
        },
    }));

    return [...eonet, ...usgs];
});
</script>

<template>
    <div class="relative h-full w-full">
        <AtomMap :features="normalizedFeatures" />

        <OrganismMapControlPanel />

        <Transition name="fade">
            <div
                v-if="eonetStore.isLoading || usgsStore.isLoading"
                class="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
            >
                <AtomSpinner />
            </div>
        </Transition>

        <Transition name="fade">
            <div
                v-if="eonetStore.error || usgsStore.error"
                class="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
            >
                <span class="text-red-400 text-lg">{{ eonetStore.error ?? usgsStore.error }}</span>
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
