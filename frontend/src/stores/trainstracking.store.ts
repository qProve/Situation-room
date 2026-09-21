import { colorManager } from '@/managers/categoryColor.manager';
import { fetchTrainstrackingEvents } from '@/services/events.service';
import type { TrainstrackingTrain } from '@/types/trainstracking.type';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export const useTrainstrackingStore = defineStore('trainstracking', () => {
    const features = ref<TrainstrackingTrain[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const fetched = ref(false);

    const selectedCategories = ref<Map<string, string>>(new Map());

    const availableCategories = computed(() => {
        const seen = new Map<string, string>();

        for (const feature of features.value) {
            const id = feature.status;
            const formatedTitle = id[0]?.toUpperCase() + id.slice(1).toLocaleLowerCase();
            if (id) seen.set(id, formatedTitle);
        }

        return seen;
    });

    const filteredFeatures = computed(() => {
        let result = features.value;

        result = result.filter((f) => selectedCategories.value.has(f.status) ?? '');

        return result;
    });

    watch(
        availableCategories,
        (cats, prevCats) => {
            if (prevCats?.size === 0 && cats.size > 0) {
                selectedCategories.value = new Map(cats);
            }
        },
        { immediate: true, flush: 'sync' },
    );

    const fetchTrainstrackingEvents_ = async () => {
        if (fetched.value) return;

        isLoading.value = true;
        error.value = null;

        try {
            features.value = await fetchTrainstrackingEvents();

            const cats = [...new Set(features.value.map((f) => f.status))];

            cats.forEach((cat) => colorManager.rent(cat));
            fetched.value = true;
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Unknown error';
        } finally {
            isLoading.value = false;
        }
    };

    return {
        features,
        isLoading,
        error,
        fetched,
        fetch: fetchTrainstrackingEvents_,
        selectedCategories,
        availableCategories,
        filteredFeatures,
    };
});
