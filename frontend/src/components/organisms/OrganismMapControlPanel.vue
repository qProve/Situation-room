<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AtomButton from '../atoms/AtomButton.vue';
import AtomToggle from '../atoms/AtomToggle.vue';
import { useEventsStore } from '@/stores/events.store.ts';
import AtomCheckbox from '../atoms/AtomCheckbox.vue';

const eventsStore = useEventsStore();

const isOpen = ref(true);
const activeOnly = ref(false);

const availableCategories = computed(() => {
    const seen = new Set<string>();

    for (const feature of eventsStore.features) {
        const id = feature.properties.categories[0]?.id;
        if (id) seen.add(id);
    }

    return [...seen];
});

const selectedCategories = ref<Set<string>>(new Set());

watch(
    availableCategories,
    (cats) => {
        selectedCategories.value = new Set(cats);
    },
    { immediate: true },
);

const emit = defineEmits<{
    'update:activeOnly': [value: boolean];
    'update:selectedCategories': [value: Set<string>];
}>();

watch(
    activeOnly,
    (val) => {
        emit('update:activeOnly', val);
    },
    { immediate: true },
);

watch(
    selectedCategories,
    (val) => {
        emit('update:selectedCategories', new Set(val));
    },
    { immediate: true, deep: true },
);

const toggleCategory = (id: string, checked: boolean) => {
    const next = new Set(selectedCategories.value);
    checked ? next.add(id) : next.delete(id);
    selectedCategories.value = next;
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

                <div class="px-4 py-3 flex flex-col gap-3">
                    <AtomToggle v-model="activeOnly" cursor="cursor-pointer">
                        Active only
                    </AtomToggle>

                    <div class="border-t border-white/10 pt-3 flex flex-col gap-2">
                        <span class="text-xs text-white/40 uppercase tracking-wider"
                            >Categories</span
                        >
                        <AtomCheckbox
                            v-for="cat in availableCategories"
                            cursor="cursor-pointer"
                            :key="cat"
                            :modelValue="selectedCategories.has(cat)"
                            @update:modelValue="(checked) => toggleCategory(cat, checked)"
                        >
                            {{ cat }}
                        </AtomCheckbox>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>
