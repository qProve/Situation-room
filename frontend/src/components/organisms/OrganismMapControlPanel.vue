<script setup lang="ts">
import { ref } from 'vue';
import AtomButton from '../atoms/AtomButton.vue';
import AtomToggle from '../atoms/AtomToggle.vue';
import { useEonetStore } from '@/stores/eonet.store.ts';
import AtomCheckbox from '../atoms/AtomCheckbox.vue';
import { colorManager } from '@/managers/categoryColor.manager.ts';
import { useUsgsStore } from '@/stores/usgs.store.ts';
import AtomAccordion from '../atoms/AtomAccordion.vue';

const eonetStore = useEonetStore();
const usgsStore = useUsgsStore();

const isOpen = ref(true);

const toggleEonetCategory = (id: string, title: string, checked: boolean) => {
    const next = new Map(eonetStore.selectedCategories);
    checked ? next.set(id, title) : next.delete(id);
    eonetStore.selectedCategories = next;
};

const toggleUsgsCategory = (id: string, title: string, checked: boolean) => {
    const next = new Map(usgsStore.selectedCategories);
    checked ? next.set(id, title) : next.delete(id);
    usgsStore.selectedCategories = next;
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
                        title="Eonet"
                        cursor="cursor-pointer"
                        :loading="eonetStore.isLoading"
                    >
                        <div class="flex flex-col gap-2">
                            <AtomToggle v-model="eonetStore.activeOnly" cursor="cursor-pointer">
                                Active only
                            </AtomToggle>
                            <div class="flex flex-col gap-2 pt-1">
                                <AtomCheckbox
                                    v-for="[id, title] in eonetStore.availableCategories"
                                    :key="id"
                                    cursor="cursor-pointer"
                                    :modelValue="eonetStore.selectedCategories.has(id)"
                                    :color="colorManager.getColor(id)"
                                    @update:modelValue="
                                        (checked) => toggleEonetCategory(id, title, checked)
                                    "
                                >
                                    {{ title }}
                                </AtomCheckbox>
                            </div>
                        </div>
                    </AtomAccordion>

                    <AtomAccordion 
                        title="Usgs"
                        cursor="cursor-pointer"
                        :loading="usgsStore.isLoading"
                    >
                        <div class="border-t border-white/10 pt-3 flex flex-col gap-2">
                            <AtomCheckbox
                                v-for="[id, title] in usgsStore.availableCategories"
                                :key="id"
                                cursor="cursor-pointer"
                                :modelValue="usgsStore.selectedCategories.has(id)"
                                :color="colorManager.getColor(id)"
                                @update:modelValue="(checked) => toggleUsgsCategory(id, title, checked)"
                            >
                                {{ title }}
                            </AtomCheckbox>
                        </div>
                    </AtomAccordion>
                </div>
            </div>
        </Transition>
    </div>
</template>
