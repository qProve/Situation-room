<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        cursor?: 'cursor-pointer' | 'cursor-default';
    }>(),
    {
        cursor: 'cursor-default',
    },
);

defineEmits<{
    'update:modelValue': [value: boolean];
}>();
</script>

<template>
    <button
        role="switch"
        :aria-checked="modelValue"
        class="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
        :class="[cursor]"
        @click="$emit('update:modelValue', !modelValue)"
    >
        <span
            class="relative inline-block w-9 h-5 rounded-full transition-colors duration-200"
            :class="modelValue ? 'bg-white/70' : 'bg-white/20'"
        >
            <span
                class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                :class="modelValue ? 'translate-x-4' : 'translate-x-0'"
            />
        </span>
        <slot />
    </button>
</template>
