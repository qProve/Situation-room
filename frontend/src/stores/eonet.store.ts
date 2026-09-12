import { colorManager } from '@/managers/categoryColor.manager';
import { fetchEonetEvents } from '@/services/events.service';
import type { EonetFeature } from '@/types/eonet.type';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export const useEonetStore = defineStore('eonet', () => {
    const features = ref<EonetFeature[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const fetched = ref(false);

    const activeOnly = ref(true);
    const selectedCategories = ref<Map<string, string>>(new Map());

    const availableCategories = computed(() => {
        const seen = new Map<string, string>();

        for (const feature of features.value) {
            const id = feature.properties.categories[0]?.id;
            const title = feature.properties.categories[0]?.title as string;

            if (!id || !title) continue;
            const formatedTitle = title[0]?.toUpperCase() + title?.slice(1).toLowerCase();
            if (id) seen.set(id, formatedTitle);
        }

        return seen;
    });

    const filteredFeatures = computed(() => {
        let result = activeOnly.value
            ? features.value.filter((f) => f.properties.closed === null)
            : features.value;

        result = result.filter((f) =>
            selectedCategories.value.has(f.properties.categories[0]?.id ?? ''),
        );

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

    const fetchEonetEvents_ = async () => {
        if (fetched.value) return;

        isLoading.value = true;
        error.value = null;

        try {
            features.value = await fetchEonetEvents();

            const cats = [
                ...new Set(features.value.map((f) => f.properties.categories[0]?.id ?? '')),
            ];
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
        fetch: fetchEonetEvents_,
        activeOnly,
        selectedCategories,
        availableCategories,
        filteredFeatures,
    };
});
