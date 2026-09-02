<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        cursor?: 'cursor-pointer' | 'cursor-default';
        color?: string;
        showCheckmark?: boolean;
    }>(),
    {
        cursor: 'cursor-default',
        showCheckmark: false,
    },
);

defineEmits<{
    'update:modelValue': [value: boolean];
}>();

const checkmarkColor = computed(() => {
    if (!props.color) return '#000000';

    const hex = props.color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
});
</script>

<template>
    <label
        class="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
        :class="[cursor]"
    >
        <input
            type="checkbox"
            class="sr-only"
            :checked="modelValue"
            @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        />
        <span
            class="w-4 h-4 rounded border flex items-center justify-center transition-colors"
            :style="modelValue && color ? { backgroundColor: color } : {}"
            :class="modelValue && !color ? 'bg-white/70' : 'bg-transparent border-white/30'"
        >
            <i
                v-if="modelValue && showCheckmark"
                class="fa-solid fa-check text-[10px]"
                :style="{ color: checkmarkColor }"
            />
        </span>
        <slot />
    </label>
</template>
