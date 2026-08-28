import { fetchUsgsEvents } from '@/services/events.service';
import type { UsgsFeature } from '@/types/usgs';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUsgsStore = defineStore('usgs', () => {
    const features = ref<UsgsFeature[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchUsgsEvents_ = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            features.value = await fetchUsgsEvents();
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Unknown error';
        } finally {
            isLoading.value = false;
        }
    };

    return { features, isLoading, error, fetch: fetchUsgsEvents_ };
});
