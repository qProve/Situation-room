<script setup lang="ts">
import { useEventsStore } from '@/stores/events.store';
import type { Feature, Point, Polygon } from 'geojson';
import { computed, onMounted, watch, ref } from 'vue';
import AtomMap from '../atoms/AtomMap.vue';
import AtomSpinner from '../atoms/AtomSpinner.vue';
import OrganismMapControlPanel from './OrganismMapControlPanel.vue';
import { registerCategories } from '@/utils/categoryColors.ts';

const eventsStore = useEventsStore();
const activeOnlyFilter = ref(false);

const onActiveOnlyChange = (val: boolean) => {
    activeOnlyFilter.value = val;
};

const selectedCategories = ref<Set<string>>(new Set());

const onSelectedCategoriesChange = (val: Set<string>) => {
    selectedCategories.value = val;
};

const normalizedFeatures = computed((): Feature<Point | Polygon>[] => {
    let features = activeOnlyFilter.value
        ? eventsStore.features.filter((f) => f.properties.closed === null)
        : eventsStore.features;

    if (selectedCategories.value.size > 0) {
        features = features.filter((f) =>
            selectedCategories.value.has(f.properties.categories[0]?.id ?? ''),
        );
    }

    return features.map((f) => ({
        ...f,
        properties: {
            ...f.properties,
            category: f.properties.categories[0]?.id ?? 'unknown',
        },
    }));
});

watch(
    () => eventsStore.features,
    (features) => {
        const cats = [...new Set(features.map((f) => f.properties.categories[0]?.id ?? ''))];
        registerCategories(cats);
    },
    { immediate: true },
);

onMounted(() => {
    eventsStore.fetch();
});
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
