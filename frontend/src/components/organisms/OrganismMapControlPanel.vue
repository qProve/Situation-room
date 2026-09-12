<script setup lang="ts">
import { computed, ref } from 'vue';
import AtomButton from '../atoms/AtomButton.vue';
import AtomAccordion from '../atoms/AtomAccordion.vue';
import AtomCheckbox from '../atoms/AtomCheckbox.vue';
import { colorManager } from '@/managers/categoryColor.manager.ts';
import type { SourceStore } from '@/sources/registry';
import { usePresetsStore } from '@/stores/presets.store.ts';
import { presets } from '@/presets/index.ts';
import { sourceRegistry } from '@/sources/index.ts';

const isOpen = ref(true);
const presetsStore = usePresetsStore();

const sources = computed(() => {
    const activePreset = presets.find((p) => p.id === presetsStore.activePreset);
    if (!activePreset) return [];

    return sourceRegistry
        .filter((source) => activePreset.sources.includes(source.id))
        .map((source) => ({
            source,
            store: source.useStore(),
        }));
});

const toggleCategory = (store: SourceStore, id: string, title: string, checked: boolean) => {
    const next = new Map(store.selectedCategories);
    checked ? next.set(id, title) : next.delete(id);
    store.selectedCategories = next;
};

const toggleAll = (store: SourceStore, checked: boolean) => {
    store.selectedCategories = checked
        ? new Map(store.availableCategories)
        : new Map<string, string>();
};
</script>

<template>
    <div class="absolute top-4 left-4 z-10">
        <Transition
            enter-from-class="opacity-0"
            enter-active-class="transition-opacity duration-200 delay-150"
            enter-to-class="opacity-100"
            leave-from-class="opacity-100"
            leave-active-class="transition-opacity duration-100"
            leave-to-class="opacity-0"
        >
            <AtomButton
                v-if="!isOpen"
                class="absolute top-0 left-0"
                icon="fa-bars"
                label="Open controls"
                size="p-2"
                click-animation="fade"
                color="text-white/50"
                @click="isOpen = true"
            />
        </Transition>

        <Transition
            enter-from-class="opacity-0 -translate-x-4"
            enter-active-class="transition-all duration-200 ease-out"
            enter-to-class="opacity-100 translate-x-0"
            leave-from-class="opacity-100 translate-x-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-to-class="opacity-0 -translate-x-4"
        >
            <div
                v-if="isOpen"
                class="absolute top-0 left-0 w-52 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-white shadow-xl"
            >
                <div class="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <span class="text-sm font-semibold tracking-wide">Controls</span>
                    <AtomButton
                        icon="fa-xmark"
                        label="Close controls"
                        size="p-1"
                        color="text-white/50"
                        align="right"
                        @click="isOpen = false"
                    />
                </div>

                <div class="px-1 py-3 flex flex-col gap-3">
                    <AtomAccordion
                        v-for="{ source, store } in sources"
                        :key="source.id"
                        :title="source.label"
                        cursor="cursor-pointer"
                        :loading="store.isLoading"
                        :checkbox="true"
                        :checkboxValue="
                            store.selectedCategories.size === store.availableCategories.size
                        "
                        @update:checkboxValue="(checked) => toggleAll(store, checked)"
                    >
                        <div class="flex flex-col gap-2">
                            <component v-if="source.controls" :is="source.controls" />
                            <div class="flex flex-col gap-2 pt-1">
                                <AtomCheckbox
                                    v-for="[id, title] in store.availableCategories"
                                    :key="id"
                                    cursor="cursor-pointer"
                                    :modelValue="store.selectedCategories.has(id)"
                                    :color="colorManager.getColor(id)"
                                    @update:modelValue="
                                        (checked) => toggleCategory(store, id, title, checked)
                                    "
                                >
                                    {{ title }}
                                </AtomCheckbox>
                            </div>
                        </div>
                    </AtomAccordion>
                </div>
            </div>
        </Transition>
    </div>
</template>
