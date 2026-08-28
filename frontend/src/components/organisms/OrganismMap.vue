<script setup lang="ts">
import { useEonetStore } from '@/stores/eonet.store.ts';
import type { Feature, Point, Polygon } from 'geojson';
import { computed, onMounted, watch, ref } from 'vue';
import AtomMap from '../atoms/AtomMap.vue';
import AtomSpinner from '../atoms/AtomSpinner.vue';
import OrganismMapControlPanel from './OrganismMapControlPanel.vue';
import { colorManager } from '@/managers/categoryColor.manager.ts';
import { useUsgsStore } from '@/stores/usgs.store.ts';

const eonetStore = useEonetStore();
const usgsStore = useUsgsStore();

onMounted(() => {
    eonetStore.fetch();
    usgsStore.fetch();
});

const activeOnlyFilter = ref(false);
const onActiveOnlyChange = (val: boolean) => {
    activeOnlyFilter.value = val;
};

const selectedCategories = ref<Map<string, string>>(new Map());
const onSelectedCategoriesChange = (val: Map<string, string>) => {
    selectedCategories.value = val;
};

const normalizedFeatures = computed((): Feature<Point | Polygon>[] => {
    const eonet = (
        activeOnlyFilter.value
            ? eonetStore.features.filter((f) => f.properties.closed === null)
            : eonetStore.features
    )
        .filter(
            (f) =>
                selectedCategories.value.size === 0 ||
                selectedCategories.value.has(f.properties.categories[0]?.id ?? ''),
        )
        .map((f) => ({
            ...f,
            properties: {
                ...f.properties,
                category: f.properties.categories[0]?.id ?? 'unknown',
            },
        }));

    const usgs = usgsStore.features.map((f) => ({
        ...f,
        properties: {
            ...f.properties,
            category: f.properties.type,
        },
    }));

    return [...eonet, ...usgs];
});

watch(
    () => eonetStore.features,
    (features) => {
        const cats = [...new Set(features.map((f) => f.properties.categories[0]?.id ?? ''))];

        cats.forEach((cat) => {
            colorManager.rent(cat);
        });
    },
    { immediate: true },
);
</script>

<template>
    <div class="relative h-full w-full">
        <AtomMap :features="normalizedFeatures" />

        <OrganismMapControlPanel
            @update:activeOnly="onActiveOnlyChange"
            @update:selectedCategories="onSelectedCategoriesChange"
        />

        <Transition name="fade">
            <div
                v-if="eonetStore.isLoading"
                class="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
            >
                <AtomSpinner />
            </div>
        </Transition>

        <Transition name="fade">
            <div
                v-if="eonetStore.error"
                class="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
            >
                <span class="text-red-400 text-lg">{{ eonetStore.error }}</span>
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
