<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue';

const props = withDefaults(
    defineProps<{
        icon?: string;
        label?: string;
        size: string;
        variant?: 'primary' | 'secondary';
        cursor?: 'cursor-pointer' | 'cursor-default';
        align?: 'left' | 'right' | 'center';
        color?: string;
        clickAnimation?: 'scale' | 'fade' | 'shake';
    }>(),
    {
        icon: 'fa-notdef',
        label: 'Not Defined',
        cursor: 'cursor-pointer',
        align: 'left',
        color: 'text-black',
    },
);

const emit = defineEmits<{
    click: [];
}>();

const isAnimating = ref(false);
const hasIcon = computed(() => !!props.icon);

let animationTimer: ReturnType<typeof setTimeout> | null = null;

const handleClick = () => {
    if (animationTimer) clearTimeout(animationTimer);
    isAnimating.value = true;
    emit('click');
    animationTimer = setTimeout(() => (isAnimating.value = false), 300);
};

onUnmounted(() => {
    if (animationTimer) clearTimeout(animationTimer);
});
</script>

<template>
    <button
        :aria-label="hasIcon ? label : undefined"
        :class="[
            variant,
            size,
            cursor,
            {
                'transition-transform duration-300 scale-80':
                    isAnimating && clickAnimation === 'scale',
                'transition-opacity duration-300 opacity-50':
                    isAnimating && clickAnimation === 'fade',
                'animate-shake': isAnimating && clickAnimation === 'shake',
                'mr-auto': align === 'left',
                'ml-auto': align === 'right',
                'mx-auto': align === 'center',
            },
        ]"
        @click="handleClick"
    >
        <i v-if="hasIcon" :class="['fa-solid', icon, color]"></i>
        <span v-else :class="color">{{ label }}</span>
    </button>
</template>

<style scoped>
@keyframes shake {
    0%,
    100% {
        transform: translateX(0);
    }
    20%,
    60% {
        transform: translateX(-3px);
    }
    40%,
    80% {
        transform: translateX(3px);
    }
}
.animate-shake {
    animation: shake 0.3s ease-in-out;
}
</style>
