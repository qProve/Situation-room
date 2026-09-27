import { colorManager } from '@/managers/categoryColor.manager';
import { fetchOpenskyEvents } from '@/services/events.service';
import { type OpenskyState, OpenskyStateCategoryMap } from '@/types/opensky.type';
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useOpenskyStore = defineStore('opensky', () => {
    const features = ref<OpenskyState[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const fetched = ref(false);

    const selectedCategories = ref<Map<string, string>>(new Map());

    const availableCategories = computed(() => {
        const seen = new Map<string, string>();

        for (const feature of features.value) {
            const categoryId = feature[17] ?? 0;
            const formattedTitle = OpenskyStateCategoryMap[categoryId] ?? 'Unknown';
            if (formattedTitle) seen.set(String(categoryId), formattedTitle);
        }

        return seen;
    });

    const filteredFeatures = computed(() => {
        return features.value.filter((f) => {
            if (f[8] === true) return false;
            if (f[5] === null || f[6] === null) return false;
            return selectedCategories.value.has(String(f[17] ?? 0));
        });
    });

    const fetchOpenskyEvents_ = async () => {
        if (fetched.value) return;

        isLoading.value = true;
        error.value = null;

        try {
            features.value = await fetchOpenskyEvents();

            const cats = [...new Set(features.value.map((f) => String(f[17] ?? 0)))];

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
        fetch: fetchOpenskyEvents_,
        selectedCategories,
        availableCategories,
        filteredFeatures,
    };
});
