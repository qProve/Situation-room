<script setup lang="ts">
import AtomToggle from '@/components/atoms/AtomToggle.vue';

defineProps<{
    activeOnly: boolean;
}>();

defineEmits<{
    'update:activeOnly': [value: boolean];
}>();
</script>

<template>
    <AtomToggle
        :modelValue="activeOnly"
        cursor="cursor-pointer"
        @update:modelValue="$emit('update:activeOnly', $event)"
    >
        Active only
    </AtomToggle>
</template>
