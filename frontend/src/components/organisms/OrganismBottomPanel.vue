<script setup lang="ts">
import { usePresetsStore } from '@/stores/presets.store.ts';
import AtomButton from '../atoms/AtomButton.vue';
import AtomDropdown from '../atoms/AtomDropdown.vue';

const presetsStore = usePresetsStore();

const dropdownOptions = presetsStore.presets.map((p) => ({
    id: p.id,
    label: p.label,
}));
</script>

<template>
    <div class="relative px-2 py-1 flex items-center bg-black">
        <div class="flex items-center gap-1 flex-1 justify-start">
            <AtomButton
                label="Settings"
                size="h-6"
                is-icon
                icon="fa-gear"
                color="text-gray-300"
                clickAnimation="scale"
            />
        </div>

        <div class="flex items-center gap-1 flex-1 justify-center"></div>

        <div class="flex items-center gap-1 flex-1 justify-end flex-row-reverse">
            <AtomDropdown
                align="right"
                :options="dropdownOptions"
                :modelValue="presetsStore.activePreset"
                direction="up"
                @update:modelValue="(id) => presetsStore.applyPreset(id)"
            />
        </div>
    </div>
</template>
