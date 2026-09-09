<script setup lang="ts">
import { useEonetStore } from '@/stores/eonet.store.ts';
import { computed } from 'vue';
import AtomMap from '../atoms/AtomMap.vue';
import OrganismMapControlPanel from './OrganismMapControlPanel.vue';
import { useUsgsStore } from '@/stores/usgs.store.ts';
import type { NormalizedFeature } from '@/types/normalized.type.ts';

const eonetStore = useEonetStore();
const usgsStore = useUsgsStore();

const normalizedFeatures = computed((): NormalizedFeature[] => {
    const eonet: NormalizedFeature[] = eonetStore.filteredFeatures.map((f) => ({
        ...f,
        properties: {
            id: f.properties.id as string,
            title: f.properties.title,
            category: f.properties.categories[0]?.id ?? 'unknown',
            link: f.properties.link,
            date: f.properties.date,
            description: f.properties.description,
            extra: {
                magnitude: f.properties.magnitudeValue
                    ? `${f.properties.magnitudeValue} ${f.properties.magnitudeUnit}`
                    : null,
                closed: f.properties.closed,
            },
        },
    }));

    const usgs: NormalizedFeature[] = usgsStore.filteredFeatures.map((f) => ({
        ...f,
        properties: {
            id: f.id as string,
            title: f.properties.title,
            category: f.properties.type ?? 'unknown',
            link: f.properties.url,
            date: new Date(f.properties.time).toISOString(),
            description: f.properties.place,
            extra: {
                magnitude: f.properties.mag,
                alert: f.properties.alert,
                felt: f.properties.felt,
            },
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
