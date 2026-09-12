import { fetchUsgsEvents } from '@/services/events.service';
import type { UsgsFeature } from '@/types/usgs.type';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { colorManager } from '@/managers/categoryColor.manager';

export const useUsgsStore = defineStore('usgs', () => {
    const features = ref<UsgsFeature[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const fetched = ref(false);

    const selectedCategories = ref<Map<string, string>>(new Map());

    const availableCategories = computed(() => {
        const seen = new Map<string, string>();

        for (const feature of features.value) {
            const id = feature.properties.type;
            const formatedTitle = id[0]?.toUpperCase() + id.slice(1).toLowerCase();
            if (id) seen.set(id, formatedTitle);
        }

        return seen;
    });

    const filteredFeatures = computed(() => {
        let result = features.value;

        result = result.filter((f) => selectedCategories.value.has(f.properties.type ?? ''));

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

    const fetchUsgsEvents_ = async () => {
        if (fetched.value) return;

        isLoading.value = true;
        error.value = null;

        try {
            features.value = await fetchUsgsEvents();

            const cats = [...new Set(features.value.map((f) => f.properties.type))];
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
        fetch: fetchUsgsEvents_,
        selectedCategories,
        availableCategories,
        filteredFeatures,
    };
});
