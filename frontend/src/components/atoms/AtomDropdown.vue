<script setup lang="ts">
import type { DropdownOption } from '@/types/dropdown.type';
import { computed, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        options: DropdownOption[];
        modelValue: string | null;
        direction: 'up' | 'down';
        iconPosition?: 'before' | 'after';
        cursor?: 'cursor-pointer' | 'cursor-default';
        align?: 'left' | 'right' | 'center';
        withArrow?: boolean;
    }>(),
    {
        icon: null,
        direction: 'down',
        iconPosition: 'before',
        cursor: 'cursor-pointer',
        align: 'left',
        withArrow: true,
    },
);

defineEmits<{
    'update:modelValue': [value: string];
}>();

const isOpen = ref(false);

const selected = computed(() => props.options.find((o) => o.id === props.modelValue));

const toggle = () => {
    isOpen.value = !isOpen.value;
};
</script>

<template>
    <div
        class="relative"
        :class="{
            'mr-auto': align === 'left',
            'ml-auto': align === 'right',
            'mx-auto': align === 'center',
        }"
    >
        <button
            @click="toggle"
            class="flex items-center gap-2 px-2 py-1 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors duration-150"
            :class="[cursor]"
        >
            <template v-if="selected">
                <i
                    v-if="selected.icon && iconPosition === 'before'"
                    :class="['fa-solid', selected.icon]"
                />
                <span>{{ selected.label }}</span>
                <i
                    v-if="selected.icon && iconPosition === 'after'"
                    :class="['fa-solid', selected.icon]"
                />
            </template>
            <span v-else class="text-white/30">Select preset</span>
            <i
                v-if="withArrow"
                class="fa-solid fa-chevron-down text-xs text-white/40 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"
            />
        </button>

        <Transition
            enter-from-class="opacity-0 translate-y-1"
            enter-active-class="transition-all duration-150 ease-out"
            enter-to-class="opacity-100 translate-y-0"
            leave-from-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-100 ease-in"
            leave-to-class="opacity-0 translate-y-1"
        >
            <div
                v-if="isOpen"
                class="absolute right-0 w-40 rounded-lg bg-white/10 backdrop-blur border border-white/10 shadow-xl overflow-hidden"
                :class="direction === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'"
            >
                <button
                    v-for="option in options"
                    :key="option.id"
                    @click="
                        $emit('update:modelValue', option.id);
                        isOpen = false;
                    "
                    class="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors duration-150 cursor-pointer"
                    :class="{ 'text-white': option.id === modelValue }"
                >
                    <i
                        v-if="option.icon && iconPosition === 'before'"
                        :class="['fa-solid', option.icon]"
                    />
                    <span>{{ option.label }}</span>
                    <i
                        v-if="option.icon && iconPosition === 'after'"
                        :class="['fa-solid', option.icon]"
                    />
                </button>
            </div>
        </Transition>
    </div>
</template>
