import { fetchEonetEvents } from '@/services/events.service';
import type { EonetFeature } from '@/types/eonet';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useEventsStore = defineStore('events', () => {
    const features = ref<EonetFeature[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchEonetEvents_ = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            features.value = await fetchEonetEvents();
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Unknown error';
        } finally {
            isLoading.value = false;
        }
    };

    return { features, isLoading, error, fetch: fetchEonetEvents_ };
});
