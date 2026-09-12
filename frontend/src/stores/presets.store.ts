import { presets } from '@/presets';
import { sourceRegistry } from '@/sources';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePresetsStore = defineStore('presets', () => {
    const activePreset = ref<string | null>(null);

    const applyPreset = async (id: string) => {
        const preset = presets.find((p) => p.id === id);
        if (!preset) return;

        activePreset.value = id;

        for (const { useStore } of sourceRegistry) {
            const store = useStore();
            store.selectedCategories = new Map();
        }

        const relevantSources = sourceRegistry.filter((s) => preset.sources.includes(s.id));
        await Promise.all(relevantSources.map((s) => s.useStore().fetch()));

        if (activePreset.value !== id) return;

        for (const { id, useStore } of relevantSources) {
            const store = useStore();
            store.selectedCategories = new Map(store.availableCategories);
        }
    };

    return { presets, activePreset, applyPreset };
});
