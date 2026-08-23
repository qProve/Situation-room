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
            :class="modelValue ? 'bg-white/70' : 'bg-transparent border-white/30'"
        >
            <i v-if="modelValue" class="" fa-solid fa-check text-white text-[10px]></i>
        </span>
        <slot />
    </label>
</template>
