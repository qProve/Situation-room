import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useEonetStore } from './eonet.store';
import { useUsgsStore } from './usgs.store';
import { presets } from '@/presets';
import { useOpenskyStore } from './opensky.store';

export const usePresetsStore = defineStore('presets', () => {
    const eonetStore = useEonetStore();
    const usgsStore = useUsgsStore();
    const openskyStore = useOpenskyStore();

    const activePreset = ref<string | null>(null);

    const applyPreset = async (id: string) => {
        const preset = presets.find((p) => p.id === id);
        if (!preset) return;

        activePreset.value = id;

        const fetchPromises = [];
        if (preset.sources.includes('eonet')) fetchPromises.push(eonetStore.fetch());
        if (preset.sources.includes('usgs')) fetchPromises.push(usgsStore.fetch());
        if (preset.sources.includes('opensky')) fetchPromises.push(openskyStore.fetch());

        await Promise.all(fetchPromises);

        eonetStore.selectedCategories = preset.sources.includes('eonet')
            ? new Map(eonetStore.availableCategories)
            : new Map();

        usgsStore.selectedCategories = preset.sources.includes('usgs')
            ? new Map(usgsStore.availableCategories)
            : new Map();

        openskyStore.selectedCategories = preset.sources.includes('opensky')
            ? new Map(openskyStore.availableCategories)
            : new Map();
    };

    return { presets, activePreset, applyPreset };
});
