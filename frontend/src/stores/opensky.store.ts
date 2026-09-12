import { colorManager } from '@/managers/categoryColor.manager';
import { fetchOpenskyEvents } from '@/services/events.service';
import { OpenskyStateCategoryMap, type OpenskyState } from '@/types/opensky.type';
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
            const categoryId = feature.category;
            const id = new String(categoryId).toString();
            let formatedTitle = '';

            if (categoryId === 1) {
                formatedTitle = OpenskyStateCategoryMap[0] ?? '';
            } else if (categoryId === 16 || categoryId === 17) {
                continue;
            }

            formatedTitle = OpenskyStateCategoryMap[categoryId] ?? '';
            if (id) seen.set(id, formatedTitle);
        }

        return seen;
    });

    const filteredFeatures = computed(() => {
        let result = features.value;

        result = result.filter((f) =>
            selectedCategories.value.has(new String(f.category).toString() ?? ''),
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

    const fetchOpenskyEvents_ = async () => {
        if (fetched.value) return;

        isLoading.value = true;
        error.value = null;

        try {
            features.value = await fetchOpenskyEvents();

            const cats = [...new Set(features.value.map((f) => new String(f.category).toString()))];
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
